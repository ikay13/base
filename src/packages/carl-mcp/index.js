#!/usr/bin/env node
/**
 * CARL MCP — Consolidated Tool Server
 * Context Augmentation & Reinforcement Layer
 *
 * Consolidates: DRL-engine + decision-logger + PSMM (new) + Staging (new)
 * 4 tool groups, all optional, activated by CARL rules.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import path from 'path';
import { fileURLToPath } from 'url';

// Tool group imports
import { TOOLS as domainTools, handleTool as handleDomain } from './tools/domains.js';
import { TOOLS as decisionTools, handleTool as handleDecision } from './tools/decisions.js';
import { TOOLS as psmmTools, handleTool as handlePsmm } from './tools/psmm.js';
import { TOOLS as stagingTools, handleTool as handleStaging } from './tools/staging.js';

// ============================================================
// CONFIGURATION
// ============================================================

// Resolve workspace from this file's location: carl-mcp/ → .base/ → workspace root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_PATH = path.resolve(__dirname, '../..');

function debugLog(...args) {
    console.error('[CARL]', new Date().toISOString(), ...args);
}

// ============================================================
// TOOL REGISTRY
// ============================================================

const ALL_TOOLS = [...domainTools, ...decisionTools, ...psmmTools, ...stagingTools];

// Build handler lookup: tool name → handler function
const TOOL_HANDLERS = {};
for (const tool of domainTools) TOOL_HANDLERS[tool.name] = handleDomain;
for (const tool of decisionTools) TOOL_HANDLERS[tool.name] = handleDecision;
for (const tool of psmmTools) TOOL_HANDLERS[tool.name] = handlePsmm;
for (const tool of stagingTools) TOOL_HANDLERS[tool.name] = handleStaging;

// ============================================================
// MCP SERVER
// ============================================================

const server = new Server({
    name: "carl-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});

debugLog('CARL MCP Server initialized');
debugLog('Workspace:', WORKSPACE_PATH);
debugLog('Tool groups: domains (%d), decisions (%d), psmm (%d), staging (%d)',
    domainTools.length, decisionTools.length, psmmTools.length, stagingTools.length);
debugLog('Total tools:', ALL_TOOLS.length);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    debugLog('List tools request');
    return { tools: ALL_TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    debugLog('Call tool:', name);

    try {
        const handler = TOOL_HANDLERS[name];
        if (!handler) {
            throw new Error(`Unknown tool: ${name}`);
        }

        const result = await handler(name, args || {}, WORKSPACE_PATH);

        if (result === null) {
            throw new Error(`Tool ${name} returned null — handler mismatch`);
        }

        return {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            isError: false,
        };
    } catch (error) {
        debugLog('Error:', error.message);
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});

// ============================================================
// RUN
// ============================================================

async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("CARL MCP Server running on stdio");
}

try {
    await runServer();
} catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
}
