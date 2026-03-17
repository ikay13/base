#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { execSync } = require('child_process');

// Colors
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const dim = '\x1b[2m';
const reset = '\x1b[0m';

// Get version from package.json
const pkg = require('../package.json');

const banner = `
${cyan}  ██████╗  █████╗ ███████╗███████╗
  ██╔══██╗██╔══██╗██╔════╝██╔════╝
  ██████╔╝███████║███████╗█████╗
  ██╔══██╗██╔══██║╚════██║██╔══╝
  ██████╔╝██║  ██║███████║███████╗
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝${reset}

  BASE Framework ${dim}v${pkg.version}${reset}
  Builder's Automated State Engine for Claude Code
`;

// Parse args
const args = process.argv.slice(2);
const hasGlobal = args.includes('--global') || args.includes('-g');
const hasLocal = args.includes('--local') || args.includes('-l');
const hasWorkspace = args.includes('--workspace') || args.includes('-w');

// Parse --config-dir argument
function parseConfigDirArg() {
  const configDirIndex = args.findIndex(arg => arg === '--config-dir' || arg === '-c');
  if (configDirIndex !== -1) {
    const nextArg = args[configDirIndex + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--config-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  const configDirArg = args.find(arg => arg.startsWith('--config-dir=') || arg.startsWith('-c='));
  if (configDirArg) {
    return configDirArg.split('=')[1];
  }
  return null;
}
const explicitConfigDir = parseConfigDirArg();

// Parse --workspace-dir argument
function parseWorkspaceDirArg() {
  const idx = args.findIndex(arg => arg === '--workspace-dir');
  if (idx !== -1) {
    const nextArg = args[idx + 1];
    if (!nextArg || nextArg.startsWith('-')) {
      console.error(`  ${yellow}--workspace-dir requires a path argument${reset}`);
      process.exit(1);
    }
    return nextArg;
  }
  return null;
}
const explicitWorkspaceDir = parseWorkspaceDirArg();
const hasHelp = args.includes('--help') || args.includes('-h');

console.log(banner);

// Show help if requested
if (hasHelp) {
  console.log(`  ${yellow}Usage:${reset} npx base-framework [options]

  ${yellow}Options:${reset}
    ${cyan}-g, --global${reset}                 Install commands globally (to ~/.claude)
    ${cyan}-l, --local${reset}                  Install commands locally (to ./.claude)
    ${cyan}-w, --workspace${reset}              Install workspace layer (.base/ in current directory)
    ${cyan}-c, --config-dir <path>${reset}      Specify custom Claude config directory
    ${cyan}--workspace-dir <path>${reset}        Specify workspace root (default: cwd)
    ${cyan}-h, --help${reset}                   Show this help message

  ${yellow}Examples:${reset}
    ${dim}# Full install: global commands + workspace layer${reset}
    npx base-framework --global --workspace

    ${dim}# Global commands only (no workspace data)${reset}
    npx base-framework --global

    ${dim}# Workspace layer only (assumes commands already installed)${reset}
    npx base-framework --workspace

    ${dim}# Install to current project only${reset}
    npx base-framework --local --workspace

  ${yellow}What gets installed:${reset}
    ${cyan}Commands (--global or --local):${reset}
      commands/base/       - Slash commands (/base:surface-create, etc.)
      skills/base/         - Skill framework (tasks, templates, context)

    ${cyan}Workspace (--workspace):${reset}
      .base/data/          - Data surface directory
      .base/hooks/         - Surface injection hooks
      .base/base-mcp/      - BASE MCP server (npm install auto-runs)
      .base/carl-mcp/      - CARL MCP server (npm install auto-runs)
      .mcp.json            - MCP server registration (merged)
`);
  process.exit(0);
}

/**
 * Expand ~ to home directory
 */
function expandTilde(filePath) {
  if (filePath && filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

/**
 * Recursively copy directory
 */
function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Install commands and skill framework
 */
function installCommands(isGlobal) {
  const src = path.join(__dirname, '..');
  const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
  const defaultGlobalDir = configDir || path.join(os.homedir(), '.claude');
  const claudeDir = isGlobal ? defaultGlobalDir : path.join(process.cwd(), '.claude');

  const locationLabel = isGlobal
    ? claudeDir.replace(os.homedir(), '~')
    : claudeDir.replace(process.cwd(), '.');

  console.log(`  Installing commands to ${cyan}${locationLabel}${reset}\n`);

  // Copy commands
  const commandsSrc = path.join(src, 'src', 'commands');
  const commandsDest = path.join(claudeDir, 'commands', 'base');
  copyDir(commandsSrc, commandsDest);
  console.log(`  ${green}+${reset} commands/base/ (3 slash commands)`);

  // Copy skill
  const skillSrc = path.join(src, 'src', 'skill');
  const skillDest = path.join(claudeDir, 'skills', 'base');
  copyDir(skillSrc, skillDest);
  console.log(`  ${green}+${reset} skills/base/ (entry point, tasks, templates, frameworks)`);

  // Copy MCP package sources into skill (for scaffold reference)
  const packagesSrc = path.join(src, 'src', 'packages');
  const packagesDest = path.join(claudeDir, 'skills', 'base', 'packages');
  copyDir(packagesSrc, packagesDest);
  console.log(`  ${green}+${reset} skills/base/packages/ (MCP sources)`);

  console.log(`\n  ${green}Commands installed.${reset}\n`);
}

/**
 * Install workspace layer (.base/)
 */
function installWorkspace() {
  const src = path.join(__dirname, '..');
  const workspaceDir = expandTilde(explicitWorkspaceDir) || process.cwd();
  const baseDir = path.join(workspaceDir, '.base');

  console.log(`  Installing workspace layer to ${cyan}${baseDir.replace(os.homedir(), '~')}${reset}\n`);

  // Create .base directories
  fs.mkdirSync(path.join(baseDir, 'data'), { recursive: true });
  fs.mkdirSync(path.join(baseDir, 'hooks'), { recursive: true });
  console.log(`  ${green}+${reset} .base/data/`);
  console.log(`  ${green}+${reset} .base/hooks/`);

  // Copy MCP servers
  const baseMcpSrc = path.join(src, 'src', 'packages', 'base-mcp');
  const baseMcpDest = path.join(baseDir, 'base-mcp');
  copyDir(baseMcpSrc, baseMcpDest);
  console.log(`  ${green}+${reset} .base/base-mcp/`);

  const carlMcpSrc = path.join(src, 'src', 'packages', 'carl-mcp');
  const carlMcpDest = path.join(baseDir, 'carl-mcp');
  copyDir(carlMcpSrc, carlMcpDest);
  console.log(`  ${green}+${reset} .base/carl-mcp/`);

  // Copy all hooks from single src/hooks/ directory
  // Surface hooks (_template, active-hook, backlog-hook) → .base/hooks/
  // Session hooks (base-pulse-check, psmm-injector) → .claude/hooks/
  const allHooksSrc = path.join(src, 'src', 'hooks');
  const surfaceHooks = ['_template.py', 'active-hook.py', 'backlog-hook.py'];
  const sessionHooks = ['base-pulse-check.py', 'psmm-injector.py'];

  const entries = fs.readdirSync(allHooksSrc);
  for (const file of entries) {
    const srcPath = path.join(allHooksSrc, file);
    if (surfaceHooks.includes(file)) {
      fs.copyFileSync(srcPath, path.join(baseDir, 'hooks', file));
    } else if (sessionHooks.includes(file)) {
      const claudeHooksDir = path.join(workspaceDir, '.claude', 'hooks');
      fs.mkdirSync(claudeHooksDir, { recursive: true });
      fs.copyFileSync(srcPath, path.join(claudeHooksDir, file));
    } else {
      // Unknown hooks default to .base/hooks/
      fs.copyFileSync(srcPath, path.join(baseDir, 'hooks', file));
    }
  }
  console.log(`  ${green}+${reset} .base/hooks/ (${surfaceHooks.length} surface hooks)`);
  console.log(`  ${green}+${reset} .claude/hooks/ (${sessionHooks.length} session hooks)`);

  // npm install for MCP servers
  console.log(`\n  Installing MCP dependencies...`);
  try {
    execSync('npm install', { cwd: baseMcpDest, stdio: 'pipe' });
    console.log(`  ${green}+${reset} base-mcp dependencies installed`);
  } catch (e) {
    console.log(`  ${yellow}!${reset} base-mcp npm install failed — run manually in .base/base-mcp/`);
  }
  try {
    execSync('npm install', { cwd: carlMcpDest, stdio: 'pipe' });
    console.log(`  ${green}+${reset} carl-mcp dependencies installed`);
  } catch (e) {
    console.log(`  ${yellow}!${reset} carl-mcp npm install failed — run manually in .base/carl-mcp/`);
  }

  // Merge MCP registrations into .mcp.json
  const mcpJsonPath = path.join(workspaceDir, '.mcp.json');
  let mcpConfig = { mcpServers: {} };
  if (fs.existsSync(mcpJsonPath)) {
    try {
      mcpConfig = JSON.parse(fs.readFileSync(mcpJsonPath, 'utf-8'));
    } catch (e) { /* start fresh */ }
  }
  mcpConfig.mcpServers['carl-mcp'] = {
    type: 'stdio',
    command: 'node',
    args: ['./.base/carl-mcp/index.js']
  };
  mcpConfig.mcpServers['base-mcp'] = {
    type: 'stdio',
    command: 'node',
    args: ['./.base/base-mcp/index.js']
  };
  fs.writeFileSync(mcpJsonPath, JSON.stringify(mcpConfig, null, 2));
  console.log(`  ${green}+${reset} .mcp.json (carl-mcp + base-mcp registered)`);

  console.log(`\n  ${green}Workspace layer installed.${reset}`);
  console.log(`  Run ${cyan}/base:scaffold${reset} to complete workspace setup.\n`);
}

/**
 * Prompt for install location
 */
function promptLocation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const configDir = expandTilde(explicitConfigDir) || expandTilde(process.env.CLAUDE_CONFIG_DIR);
  const globalPath = configDir || path.join(os.homedir(), '.claude');
  const globalLabel = globalPath.replace(os.homedir(), '~');

  console.log(`  ${yellow}What would you like to install?${reset}

  ${cyan}1${reset}) Full install  ${dim}(commands to ${globalLabel} + workspace layer to .base/)${reset}
  ${cyan}2${reset}) Commands only  ${dim}(${globalLabel})${reset}
  ${cyan}3${reset}) Workspace only ${dim}(.base/ in current directory)${reset}
`);

  rl.question(`  Choice ${dim}[1]${reset}: `, (answer) => {
    rl.close();
    const choice = answer.trim() || '1';
    if (choice === '1' || choice === '2') {
      installCommands(true);
    }
    if (choice === '1' || choice === '3') {
      installWorkspace();
    }
    if (choice !== '1' && choice !== '2' && choice !== '3') {
      installCommands(true);
      installWorkspace();
    }
    console.log(`  ${green}Done!${reset} Launch Claude Code and run ${cyan}/base:surface-list${reset}.\n`);
  });
}

// Main
if (hasHelp) {
  // Already handled above
} else if (hasGlobal || hasLocal || hasWorkspace) {
  if (hasGlobal && hasLocal) {
    console.error(`  ${yellow}Cannot specify both --global and --local${reset}`);
    process.exit(1);
  }
  if (hasGlobal || hasLocal) {
    installCommands(hasGlobal);
  }
  if (hasWorkspace) {
    installWorkspace();
  }
  console.log(`  ${green}Done!${reset} Launch Claude Code and run ${cyan}/base:surface-list${reset}.\n`);
} else {
  promptLocation();
}
