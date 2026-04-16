# MCP (Model Context Protocol) - Practical Implementation Guide

Get from zero to a working MCP server in 30 minutes.

---

## 1. What is MCP?

**MCP (Model Context Protocol)** is an open protocol that standardizes how applications provide context to LLMs. Think of it like a USB-C port for AI—one standard interface that lets Claude (and other LLMs) connect to external tools, data sources, and services.

With MCP, you can:
- Expose custom **tools** that Claude can call
- Share **resources** (data, files, APIs) with Claude
- Provide **prompts** that Claude can use as templates

---

## 2. Installation

```bash
# Create a new project
mkdir my-mcp-server && cd my-mcp-server
npm init -y

# Install the official SDK
npm install @modelcontextprotocol/sdk zod

# Install dev dependencies
npm install --save-dev @types/node typescript

# Initialize TypeScript
npx tsc --init
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 3. Key Concepts

### Tools
Functions that Claude can **call** to perform actions. They have:
- `name`: Unique identifier
- `description`: What it does (Claude uses this to decide when to call it)
- `inputSchema`: Zod schema defining parameters

### Resources
Data that Claude can **read**. Exposed as URIs like:
- `file:///path/to/file.txt`
- `db://users/123`
- `api://weather/london`

### Prompts
Templates that Claude can **use** to structure conversations. They accept arguments and return formatted messages.

---

## 4. Working Code Example

Create `src/server.ts`:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// === TOOL DEFINITIONS ===
const CalculateSchema = z.object({
  operation: z.enum(["add", "subtract", "multiply", "divide"]),
  a: z.number(),
  b: z.number(),
});

// === SERVER SETUP ===
const server = new Server(
  {
    name: "my-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// === LIST AVAILABLE TOOLS ===
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "calculate",
        description: "Perform basic math operations",
        inputSchema: {
          type: "object",
          properties: {
            operation: {
              type: "string",
              enum: ["add", "subtract", "multiply", "divide"],
              description: "The math operation to perform",
            },
            a: { type: "number", description: "First number" },
            b: { type: "number", description: "Second number" },
          },
          required: ["operation", "a", "b"],
        },
      },
      {
        name: "get_current_time",
        description: "Get the current server time",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// === HANDLE TOOL CALLS ===
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "calculate") {
    const { operation, a, b } = CalculateSchema.parse(args);
    let result: number;

    switch (operation) {
      case "add":
        result = a + b;
        break;
      case "subtract":
        result = a - b;
        break;
      case "multiply":
        result = a * b;
        break;
      case "divide":
        result = a / b;
        break;
    }

    return {
      content: [
        {
          type: "text",
          text: `Result: ${result}`,
        },
      ],
    };
  }

  if (name === "get_current_time") {
    return {
      content: [
        {
          type: "text",
          text: `Current time: ${new Date().toISOString()}`,
        },
      ],
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// === LIST RESOURCES ===
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "info://server-status",
        name: "Server Status",
        mimeType: "application/json",
      },
    ],
  };
});

// === READ RESOURCE ===
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "info://server-status") {
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify({
            status: "running",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// === START SERVER ===
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);
```

---

## 5. Build & Configure

```bash
# Build the TypeScript
npx tsc

# Make the entry point executable
chmod +x dist/server.js

# Add shebang to dist/server.js (prepend this line):
#!/usr/bin/env node
```

---

## 6. Connect to Claude Desktop

### Step 1: Find Claude Desktop Config

**macOS:**
```bash
# Config location
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```bash
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Edit Config

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "node",
      "args": ["/absolute/path/to/my-mcp-server/dist/server.js"],
      "env": {}
    }
  }
}
```

**Pro tip:** Use `which node` to get the full path to Node for the `command` field.

### Step 3: Restart Claude Desktop

1. Fully quit Claude Desktop (Cmd+Q / Ctrl+Q)
2. Reopen it
3. Look for the 🔨 hammer icon in the chat input — that means your tools are connected

---

## 7. Testing Your Server

Once connected, you can ask Claude:

> "Calculate 42 * 18 using your tool"
> "What's the current server time?"

Claude will automatically detect and use your tools when appropriate.

---

## 8. Debugging Tips

**View logs:**
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
# Check Event Viewer or %APPDATA%\Claude\logs
```

**Test server manually:**
```bash
# Send a JSON-RPC request manually
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js
```

**Common issues:**
- ❌ Use full paths in claude_desktop_config.json
- ❌ Ensure the file is executable
- ❌ Check that node is in your PATH
- ❌ Verify JSON syntax in config file

---

## 9. Next Steps

- **Add more tools:** Wrap any API or function
- **Implement resources:** Expose databases, files, or external APIs
- **Add prompts:** Create reusable conversation templates
- **Explore the SDK:** https://github.com/modelcontextprotocol/typescript-sdk

---

## Quick Reference

```bash
# Scaffold new server
npm init -y && npm i @modelcontextprotocol/sdk zod

# Build
npx tsc

# Test connection
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server.js
```

**That's it!** You now have a working MCP server. 🚀
