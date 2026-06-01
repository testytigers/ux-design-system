/**
 * UX Design System — MCP server entry point.
 *
 * Exposes tokens, components, theming, and validation as MCP tools so any
 * MCP-aware client (Claude Desktop, Cursor, Zed, Continue, …) can query
 * the design system without ever loading the source codebase by hand.
 *
 * Transport: stdio (the standard for MCP clients).
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

import { REPO_ROOT, loadTokens, loadComponents } from "./data.js"
import { tokenTools } from "./tools/tokens.js"
import { componentTools } from "./tools/components.js"
import { systemTools } from "./tools/system.js"
import { compositionTools } from "./tools/composition.js"

// ── Register every tool ──────────────────────────────────────────────────────
const allTools = [...tokenTools, ...componentTools, ...systemTools, ...compositionTools]
const toolMap = new Map(allTools.map(t => [t.name, t]))

// ── Boot the server ─────────────────────────────────────────────────────────
const server = new Server(
  {
    name: "@ux/mcp-design-system",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
}))

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const tool = toolMap.get(req.params.name)
  if (!tool) {
    return {
      isError: true,
      content: [{ type: "text", text: `Unknown tool: ${req.params.name}` }],
    }
  }
  try {
    return await tool.handler(req.params.arguments ?? {} as any)
  } catch (err) {
    return {
      isError: true,
      content: [{ type: "text", text: `Tool ${req.params.name} threw: ${err instanceof Error ? err.message : String(err)}` }],
    }
  }
})

// ── Pre-load (fail fast on misconfigured repo) ──────────────────────────────
const tokens = loadTokens()
const components = loadComponents()
process.stderr.write(
  `[ux-mcp] booted from ${REPO_ROOT}\n` +
  `[ux-mcp] loaded ${tokens.length} tokens, ${components.length} components, ${allTools.length} tools\n`
)

// ── Connect stdio transport ─────────────────────────────────────────────────
const transport = new StdioServerTransport()
await server.connect(transport)
