/**
 * Next.js App Router adapter for @ux/mcp-design-system.
 *
 * Exposes the full MCP tool surface over HTTP using the Web Standard
 * Streamable HTTP transport — no stdio, no long-lived process required.
 *
 * ── Quick start ──────────────────────────────────────────────────────────────
 *
 * 1. Create the route file in your Next.js app:
 *
 *    // app/api/mcp/route.ts
 *    export const runtime = 'nodejs'          // fs access required
 *    export { GET, POST, DELETE } from '@ux/mcp-design-system/next'
 *
 * 2. Tell the MCP where the design-system repo lives (only needed when your
 *    Next.js project root differs from the design-system repo root):
 *
 *    # .env.local
 *    UX_DS_ROOT=/absolute/path/to/ux-design-system
 *
 * 3. Point any MCP client at  http://localhost:3000/api/mcp
 *
 * ── Custom options ────────────────────────────────────────────────────────────
 *
 *    // app/api/mcp/route.ts
 *    export const runtime = 'nodejs'
 *    import { createMcpHandler } from '@ux/mcp-design-system/next'
 *    export const { GET, POST, DELETE } = createMcpHandler({
 *      repoRoot: '/absolute/path/to/ux-design-system',
 *    })
 *
 * ── Transport notes ──────────────────────────────────────────────────────────
 *
 * • Stateless mode — no sessions, no in-memory state between requests.
 *   All tool handlers are pure reads from a module-level cache seeded at
 *   first request; subsequent cold starts in serverless environments reload
 *   that cache automatically.
 *
 * • JSON responses — tool results are returned as plain JSON (no SSE stream),
 *   which is simpler, proxy-friendly, and right-sized for a read-only MCP.
 *
 * • GET is forwarded to the transport for MCP protocol compliance (some clients
 *   probe it); DELETE is forwarded for session-termination requests.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"

import { loadTokens, loadComponents } from "./data.js"
import { tokenTools } from "./tools/tokens.js"
import { componentTools } from "./tools/components.js"
import { systemTools } from "./tools/system.js"
import { compositionTools } from "./tools/composition.js"

// ── Tool registry (shared, read-only) ────────────────────────────────────────
const allTools = [...tokenTools, ...componentTools, ...systemTools, ...compositionTools]
const toolMap = new Map(allTools.map(t => [t.name, t]))

function buildServer(): Server {
  const server = new Server(
    { name: "@ux/mcp-design-system", version: "0.1.0" },
    { capabilities: { tools: {} } }
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
        content: [{ type: "text" as const, text: `Unknown tool: ${req.params.name}` }],
      }
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return await tool.handler(req.params.arguments ?? {} as any)
    } catch (err) {
      return {
        isError: true,
        content: [{
          type: "text" as const,
          text: `Tool ${req.params.name} threw: ${err instanceof Error ? err.message : String(err)}`,
        }],
      }
    }
  })

  return server
}

// ── Handler options ───────────────────────────────────────────────────────────
export interface McpHandlerOptions {
  /**
   * Absolute path to the design-system repo root.
   * Takes precedence over the UX_DS_ROOT environment variable.
   * Useful when your Next.js project is not co-located with the design system.
   */
  repoRoot?: string
}

// ── createMcpHandler — factory for custom setups ─────────────────────────────
/**
 * Returns `{ GET, POST, DELETE }` handlers ready to be re-exported from a
 * Next.js App Router route file.
 *
 * Each handler is a function `(req: Request) => Promise<Response>` — the exact
 * shape Next.js App Router expects.
 */
export function createMcpHandler(options: McpHandlerOptions = {}) {
  // Apply repoRoot before the data module resolves it (must happen before
  // loadTokens/loadComponents are called for the first time).
  if (options.repoRoot) {
    process.env.UX_DS_ROOT = options.repoRoot
  }

  // ── Lazy-init singleton transport + server ──────────────────────────────────
  // We use a single transport instance in stateless mode so the Web Standard
  // transport can manage its own internal request routing.  The server is
  // connected once; all tool calls are pure reads so there is no shared
  // mutable state to guard against concurrent requests.
  let transport: WebStandardStreamableHTTPServerTransport | null = null

  async function ensureReady(): Promise<WebStandardStreamableHTTPServerTransport> {
    if (transport) return transport

    // Pre-warm the data cache so the first tool call is fast.
    loadTokens()
    loadComponents()

    transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — no sessions
      enableJsonResponse: true,      // return plain JSON, not SSE
    })

    const server = buildServer()
    await server.connect(transport)

    return transport
  }

  async function handler(req: Request): Promise<Response> {
    const t = await ensureReady()
    return t.handleRequest(req)
  }

  return { GET: handler, POST: handler, DELETE: handler }
}

// ── Pre-built default exports ─────────────────────────────────────────────────
// The simplest usage: `export { GET, POST, DELETE } from '@ux/mcp-design-system/next'`
const { GET, POST, DELETE } = createMcpHandler()
export { GET, POST, DELETE }
