/**
 * BASE Surfaces — Generic CRUD tools for registered data surfaces
 * Operates on any surface registered in workspace.json
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

function debugLog(...args) {
    console.error('[BASE:surfaces]', new Date().toISOString(), ...args);
}

// ============================================================
// HELPERS
// ============================================================

function getWorkspaceJson(workspacePath) {
    const filepath = join(workspacePath, '.base', 'workspace.json');
    if (!existsSync(filepath)) {
        throw new Error('workspace.json not found at ' + filepath);
    }
    try {
        return JSON.parse(readFileSync(filepath, 'utf-8'));
    } catch (error) {
        throw new Error('Failed to parse workspace.json: ' + error.message);
    }
}

function getSurfaceConfig(workspacePath, surface) {
    const ws = getWorkspaceJson(workspacePath);
    const surfaces = ws.surfaces || {};
    const config = surfaces[surface];
    if (!config) {
        throw new Error(`Surface "${surface}" is not registered in workspace.json. Registered surfaces: ${Object.keys(surfaces).join(', ') || 'none'}`);
    }
    return config;
}

function getSurfacePath(workspacePath, config) {
    return join(workspacePath, '.base', config.file);
}

function readSurface(workspacePath, surface) {
    const config = getSurfaceConfig(workspacePath, surface);
    const filepath = getSurfacePath(workspacePath, config);
    if (!existsSync(filepath)) {
        return { surface, version: 1, last_modified: null, items: [], archived: [] };
    }
    try {
        return JSON.parse(readFileSync(filepath, 'utf-8'));
    } catch (error) {
        debugLog(`Error reading ${surface} data:`, error.message);
        return { surface, version: 1, last_modified: null, items: [], archived: [] };
    }
}

function writeSurface(workspacePath, surface, data) {
    const config = getSurfaceConfig(workspacePath, surface);
    const filepath = getSurfacePath(workspacePath, config);
    data.last_modified = formatTimestamp();
    writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

function generateId(prefix, items) {
    let max = 0;
    for (const item of items) {
        const id = item.id || '';
        const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > max) max = num;
        }
    }
    return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

function formatTimestamp() {
    return new Date().toISOString();
}

// ============================================================
// TOOL DEFINITIONS
// ============================================================

export const TOOLS = [
    {
        name: "base_list_surfaces",
        description: "List all registered data surfaces from workspace.json with item counts. Returns surface names, descriptions, and current item counts.",
        inputSchema: {
            type: "object",
            properties: {},
            required: []
        }
    },
    {
        name: "base_get_surface",
        description: "Read all items from a registered data surface. Returns the full surface object including metadata, items array, and archived array.",
        inputSchema: {
            type: "object",
            properties: {
                surface: {
                    type: "string",
                    description: "Surface name (e.g., 'active', 'backlog')"
                }
            },
            required: ["surface"]
        }
    },
    {
        name: "base_get_item",
        description: "Get a specific item by ID from a data surface.",
        inputSchema: {
            type: "object",
            properties: {
                surface: {
                    type: "string",
                    description: "Surface name (e.g., 'active', 'backlog')"
                },
                id: {
                    type: "string",
                    description: "Item ID (e.g., 'ACT-001', 'BL-003')"
                }
            },
            required: ["surface", "id"]
        }
    },
    {
        name: "base_add_item",
        description: "Add a new item to a data surface. Auto-generates ID from surface schema's id_prefix. Validates required fields if schema defines them.",
        inputSchema: {
            type: "object",
            properties: {
                surface: {
                    type: "string",
                    description: "Surface name (e.g., 'active', 'backlog')"
                },
                data: {
                    type: "object",
                    description: "Item data object with fields matching the surface schema"
                }
            },
            required: ["surface", "data"]
        }
    },
    {
        name: "base_update_item",
        description: "Update an existing item's fields by ID. Performs shallow merge — only specified fields are updated, others preserved.",
        inputSchema: {
            type: "object",
            properties: {
                surface: {
                    type: "string",
                    description: "Surface name (e.g., 'active', 'backlog')"
                },
                id: {
                    type: "string",
                    description: "Item ID to update"
                },
                data: {
                    type: "object",
                    description: "Fields to update (shallow merge onto existing item)"
                }
            },
            required: ["surface", "id", "data"]
        }
    },
    {
        name: "base_archive_item",
        description: "Archive an item by ID — removes from items array and moves to archived array with timestamp.",
        inputSchema: {
            type: "object",
            properties: {
                surface: {
                    type: "string",
                    description: "Surface name (e.g., 'active', 'backlog')"
                },
                id: {
                    type: "string",
                    description: "Item ID to archive"
                }
            },
            required: ["surface", "id"]
        }
    },
    {
        name: "base_search",
        description: "Search across one or all registered surfaces by keyword. Case-insensitive substring match across all string fields in each item.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "Search query (case-insensitive substring match)"
                },
                surface: {
                    type: "string",
                    description: "Optional: limit search to one surface. Omit to search all."
                }
            },
            required: ["query"]
        }
    }
];

// ============================================================
// TOOL HANDLERS
// ============================================================

function handleListSurfaces(workspacePath) {
    const ws = getWorkspaceJson(workspacePath);
    const surfaces = ws.surfaces || {};
    const result = [];

    for (const [name, config] of Object.entries(surfaces)) {
        const filepath = join(workspacePath, '.base', config.file);
        let itemsCount = 0;
        if (existsSync(filepath)) {
            try {
                const data = JSON.parse(readFileSync(filepath, 'utf-8'));
                itemsCount = (data.items || []).length;
            } catch { /* ignore parse errors */ }
        }
        result.push({
            name,
            description: config.description || '',
            file: config.file,
            items_count: itemsCount,
            hook: config.hook || false
        });
    }

    return { surfaces: result, count: result.length };
}

function handleGetSurface(args, workspacePath) {
    const { surface } = args;
    if (!surface) throw new Error('Missing required parameter: surface');
    return readSurface(workspacePath, surface);
}

function handleGetItem(args, workspacePath) {
    const { surface, id } = args;
    if (!surface) throw new Error('Missing required parameter: surface');
    if (!id) throw new Error('Missing required parameter: id');

    const data = readSurface(workspacePath, surface);
    const item = data.items.find(i => i.id === id);
    if (!item) {
        throw new Error(`Item "${id}" not found in surface "${surface}". Available IDs: ${data.items.map(i => i.id).join(', ') || 'none'}`);
    }
    return item;
}

function handleAddItem(args, workspacePath) {
    const { surface, data: itemData } = args;
    if (!surface) throw new Error('Missing required parameter: surface');
    if (!itemData) throw new Error('Missing required parameter: data');

    const config = getSurfaceConfig(workspacePath, surface);
    const schema = config.schema || {};

    // Validate required fields
    if (schema.required_fields) {
        for (const field of schema.required_fields) {
            if (itemData[field] === undefined || itemData[field] === null || itemData[field] === '') {
                throw new Error(`Missing required field "${field}" for surface "${surface}". Required: ${schema.required_fields.join(', ')}`);
            }
        }
    }

    const surfaceData = readSurface(workspacePath, surface);

    // Generate ID
    const prefix = schema.id_prefix || surface.toUpperCase().slice(0, 3);
    const newId = generateId(prefix, surfaceData.items);

    const newItem = {
        id: newId,
        ...itemData,
        added: formatTimestamp()
    };

    surfaceData.items.push(newItem);
    writeSurface(workspacePath, surface, surfaceData);

    debugLog(`Added item ${newId} to ${surface}`);
    return newItem;
}

function handleUpdateItem(args, workspacePath) {
    const { surface, id, data: updateData } = args;
    if (!surface) throw new Error('Missing required parameter: surface');
    if (!id) throw new Error('Missing required parameter: id');
    if (!updateData) throw new Error('Missing required parameter: data');

    const surfaceData = readSurface(workspacePath, surface);
    const index = surfaceData.items.findIndex(i => i.id === id);
    if (index === -1) {
        throw new Error(`Item "${id}" not found in surface "${surface}"`);
    }

    // Shallow merge — preserve existing fields, update specified ones
    surfaceData.items[index] = {
        ...surfaceData.items[index],
        ...updateData,
        id, // Prevent ID overwrite
        updated: formatTimestamp()
    };

    writeSurface(workspacePath, surface, surfaceData);

    debugLog(`Updated item ${id} in ${surface}`);
    return surfaceData.items[index];
}

function handleArchiveItem(args, workspacePath) {
    const { surface, id } = args;
    if (!surface) throw new Error('Missing required parameter: surface');
    if (!id) throw new Error('Missing required parameter: id');

    const surfaceData = readSurface(workspacePath, surface);
    const index = surfaceData.items.findIndex(i => i.id === id);
    if (index === -1) {
        throw new Error(`Item "${id}" not found in surface "${surface}"`);
    }

    // Remove from items
    const [item] = surfaceData.items.splice(index, 1);
    item.archived = formatTimestamp();

    // Add to archived array
    if (!surfaceData.archived) surfaceData.archived = [];
    surfaceData.archived.push(item);

    writeSurface(workspacePath, surface, surfaceData);

    debugLog(`Archived item ${id} from ${surface}`);
    return item;
}

function handleSearch(args, workspacePath) {
    const { query, surface: targetSurface } = args;
    if (!query) throw new Error('Missing required parameter: query');

    const ws = getWorkspaceJson(workspacePath);
    const surfaces = ws.surfaces || {};
    const queryLower = query.toLowerCase();
    const results = [];

    const surfacesToSearch = targetSurface
        ? { [targetSurface]: getSurfaceConfig(workspacePath, targetSurface) }
        : surfaces;

    for (const [name, config] of Object.entries(surfacesToSearch)) {
        const filepath = join(workspacePath, '.base', config.file);
        if (!existsSync(filepath)) continue;

        let data;
        try {
            data = JSON.parse(readFileSync(filepath, 'utf-8'));
        } catch { continue; }

        for (const item of (data.items || [])) {
            for (const [field, value] of Object.entries(item)) {
                if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
                    results.push({
                        surface: name,
                        id: item.id,
                        title: item.title || item.id,
                        match_field: field
                    });
                    break; // One match per item is enough
                }
            }
        }
    }

    return { results, count: results.length, query };
}

// ============================================================
// HANDLER DISPATCH
// ============================================================

export function handleTool(name, args, workspacePath) {
    switch (name) {
        case 'base_list_surfaces':
            return handleListSurfaces(workspacePath);
        case 'base_get_surface':
            return handleGetSurface(args, workspacePath);
        case 'base_get_item':
            return handleGetItem(args, workspacePath);
        case 'base_add_item':
            return handleAddItem(args, workspacePath);
        case 'base_update_item':
            return handleUpdateItem(args, workspacePath);
        case 'base_archive_item':
            return handleArchiveItem(args, workspacePath);
        case 'base_search':
            return handleSearch(args, workspacePath);
        default:
            return null;
    }
}
