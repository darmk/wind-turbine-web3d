// Keep npm run commands usable on this workstation's legacy default Node.
const { existsSync } = require('node:fs');
const { join, delimiter, dirname } = require('node:path');
const { spawnSync } = require('node:child_process');
const os = require('node:os');
const root = join(__dirname, '..');
const runtime = process.env.EN182_NODE || (Number(process.versions.node.split('.')[0]) >= 22 ? process.execPath : join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'bin', 'node.exe'));
if (!existsSync(runtime)) { console.error('Please install Node 22.12+ or set EN182_NODE to a modern Node executable.'); process.exit(1); }
const entries = { vite: 'vite/bin/vite.js', 'vue-tsc': 'vue-tsc/bin/vue-tsc.js', tsx: 'tsx/dist/cli.mjs', playwright: '@playwright/test/cli.js' };
const tool = process.argv[2];
if (!entries[tool]) throw new Error('Unknown tool: '+tool);
const result = spawnSync(runtime, [join(root,'node_modules',entries[tool]), ...process.argv.slice(3)], { cwd:root, stdio:'inherit', env:{...process.env, PATH:dirname(runtime)+delimiter+process.env.PATH} });
if (result.error) console.error(result.error);
process.exit(result.status ?? 1);
