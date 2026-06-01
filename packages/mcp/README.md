# @ux/mcp-design-system

An [MCP](https://modelcontextprotocol.io) server that exposes the UX Design System (tokens, components, theming, validation) to any MCP-aware client — Claude Desktop, Cursor, Zed, Continue, or your own agent.

Any AI that connects to this server can:

- list every CSS variable and resolve a semantic role in light or dark mode
- get the full TSX source of any of the 40 components
- read the brand summary + voice guidelines
- validate that a piece of generated CSS/HTML/TSX uses only defined tokens

The server reads live from this repo's `styles/globals.css` and `packages/react/src/components/`. Changes to the source are visible to MCP consumers immediately — no rebuild required.

## Tool surface (20 tools)

### Tokens

| Tool | What |
|---|---|
| `list_token_categories` | Categories present: `color.purple`, `spacing`, `radius`, … |
| `list_tokens` | Every `--ux-*` variable (optionally filter by category) |
| `get_token` | One token by name (e.g. `purple-600`) |
| `get_color_palette` | One palette as `{step: hex}` |
| `get_semantic_color` | Resolve a role (e.g. `bg.primary`) in light or dark mode |
| `get_dark_mode_overrides` | All variables that flip between modes |
| `get_typography_scale` | Families, sizes, weights, line-heights, letter-spacings |
| `get_spacing_scale` | Every spacing rung |
| `get_radius_scale` | Every radius value |
| `get_shadow_scale` | Every shadow string |
| `search_tokens` | Substring search across names and values |

### Components

| Tool | What |
|---|---|
| `list_components` | All 40 components with category and one-line description |
| `get_component` | Full metadata: exports, CVA variants, defaults, prop flags |
| `get_component_source` | Full TSX source code |
| `get_component_variants` | Just the variant matrix |
| `search_components` | Substring across name, description, exports |

### System

| Tool | What |
|---|---|
| `get_brand_summary` | One-shot identity: color, fonts, density, voice, hard rules |
| `get_design_principles` | Copy voice guidelines + examples |
| `validate_token_references` | Find unresolved `var(--ux-*)` references in a snippet |
| `validate_dark_mode_parity` | Sanity-check semantic tokens have distinct dark values |

## Install + run

```bash
# from the repo root
cd packages/mcp
pnpm install      # or npm install
pnpm build        # or npm run build
```

Then launch it:

```bash
node dist/server.js
# or, once published:
npx -y @ux/mcp-design-system
```

The server speaks stdio. On its own it does nothing visible — connect it to a client.

## Wiring it to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "ux-design-system": {
      "command": "node",
      "args": ["/absolute/path/to/ux-design-system/packages/mcp/dist/server.js"],
      "env": {
        "UX_DS_ROOT": "/absolute/path/to/ux-design-system"
      }
    }
  }
}
```

Restart Claude Desktop. The tools appear in the connector panel; Claude can now call `get_color_palette`, `get_component_source`, etc.

## Wiring it to Cursor

In `~/.cursor/mcp.json` (or your workspace `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ux-design-system": {
      "command": "node",
      "args": ["/absolute/path/to/ux-design-system/packages/mcp/dist/server.js"]
    }
  }
}
```

## Wiring it to Zed

In `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "ux-design-system": {
      "command": {
        "path": "node",
        "args": ["/absolute/path/to/ux-design-system/packages/mcp/dist/server.js"]
      }
    }
  }
}
```

## Wiring it to Continue (VS Code / JetBrains)

In your Continue config:

```json
{
  "mcpServers": [
    {
      "name": "ux-design-system",
      "command": "node",
      "args": ["/absolute/path/to/ux-design-system/packages/mcp/dist/server.js"]
    }
  ]
}
```

## Configuring the data source

The server auto-discovers the repo root by walking up from its installed path until it finds `styles/globals.css`. If that fails (e.g. you installed the package globally and the repo lives elsewhere), set:

```bash
UX_DS_ROOT=/path/to/ux-design-system
```

### Pointing at a forked design system (`@brand/ds`)

This repo ships a second design system in `packages/brand-ds` that uses a violet palette (`#8774e1`) and the `--ds-*` token prefix. Set three env vars to use it:

```bash
UX_DS_ROOT=/path/to/ux-design-system/packages/brand-ds
UX_DS_COMPONENTS_DIR=/path/to/ux-design-system/packages/brand-ds/src/components
UX_DS_TOKEN_PREFIX=--ds-
```

With these set the MCP reads `brand-ds/styles/globals.css` for tokens and `brand-ds/src/components/` for component source. All 20 tools work identically; `list_token_categories` will return `color.violet` instead of `color.purple`, and `get_color_palette("violet")` returns the `#8774e1` scale.

See `packages/brand-ds/README.md` for the full agent reference — component list, layout system, hard rules, and copy guidelines.

## Example interactions

Once wired up, Claude can do things like:

> **You:** Give me the secondary surface in dark mode.
> **Claude (calling `get_semantic_color`):** `--ux-color-bg-secondary` in dark mode = `var(--ux-color-neutral-900)` = `#18181b`.

> **You:** Show me the Button source so I can fork it into a Loading button.
> **Claude (calling `get_component_source`):** [returns full Button.tsx]

> **You:** Validate this CSS uses only defined tokens.
> **Claude (calling `validate_token_references`):** `ok: false, missing: ['--ux-color-purple-1000']` — purple stops at 950.

## Development

```bash
pnpm typecheck     # tsc --noEmit
pnpm build         # tsc + post-process
pnpm start         # launch the built server (handshake with stdio client)
```

For a quick smoke test without a client:

```bash
# Sends a tools/list request, prints the response, then quits.
node -e '
const { spawn } = require("child_process")
const child = spawn("node", ["dist/server.js"], { stdio: ["pipe", "pipe", "inherit"] })
const req = { jsonrpc: "2.0", id: 1, method: "tools/list" }
child.stdin.write(JSON.stringify(req) + "\n")
child.stdout.on("data", d => { console.log(d.toString()); child.kill() })
'
```

## Next.js (HTTP transport)

The package ships a `next` entry-point that wraps the MCP in a Web Standard Streamable HTTP transport, so you can serve it directly from a Next.js App Router route — no separate process or stdio required.

### 1 — Create the route

```ts
// app/api/mcp/route.ts
export const runtime = 'nodejs'           // required — tools use Node fs

export { GET, POST, DELETE } from '@ux/mcp-design-system/next'
```

### 2 — Configure the repo root (if needed)

When your Next.js project root is the same directory as the design-system repo, nothing else is needed. If they differ, set:

```bash
# .env.local
UX_DS_ROOT=/absolute/path/to/ux-design-system
```

Or pass it in code:

```ts
// app/api/mcp/route.ts
export const runtime = 'nodejs'
import { createMcpHandler } from '@ux/mcp-design-system/next'

export const { GET, POST, DELETE } = createMcpHandler({
  repoRoot: '/absolute/path/to/ux-design-system',
})
```

### 3 — Point your MCP client at it

```
http://localhost:3000/api/mcp
```

Any MCP client that supports the Streamable HTTP transport works (Claude Desktop ≥ 0.10, Cursor, Continue, etc.).

### Transport notes

| Detail | Value |
|---|---|
| Transport | Web Standard Streamable HTTP (`WebStandardStreamableHTTPServerTransport`) |
| Session mode | Stateless — no session IDs, safe for serverless / edge invocations |
| Response format | Plain JSON (not SSE) — proxy-friendly, no chunked-encoding quirks |
| Runtime requirement | `nodejs` — the tools read `styles/globals.css` and component `.tsx` files via `fs` |

---

## What this is NOT

- Not a renderer. The server returns data and source code; it does not produce images, HTML, or Figma frames.
- Not a write-side. All tools are read-only; nothing in the repo gets modified by MCP calls.
- Not a remote service. It runs locally over stdio — no network, no auth.

If you want a hosted variant (HTTP/SSE transport), the @modelcontextprotocol/sdk supports it; the tool layer in `src/tools/` is transport-agnostic — only `src/server.ts` would change.
