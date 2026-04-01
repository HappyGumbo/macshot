"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const commander_1 = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const compose_1 = require("./compose");
const themes_1 = require("./themes");
function loadConfig() {
    const configPath = (0, path_1.resolve)((0, os_1.homedir)(), '.macshot.json');
    if (!(0, fs_1.existsSync)(configPath))
        return {};
    try {
        return JSON.parse((0, fs_1.readFileSync)(configPath, 'utf-8'));
    }
    catch {
        return {};
    }
}
function run() {
    const program = new commander_1.Command();
    program
        .name('macshot')
        .description('Decorate screenshots with macOS window frames')
        .version('1.0.0')
        .argument('[input]', 'Input screenshot file')
        .option('-o, --output <path>', 'Output file path')
        .option('-t, --theme <name>', `Background theme (${Object.keys(themes_1.themes).join(', ')})`)
        .option('--title <text>', 'Window title bar text')
        .option('--dark', 'Dark mode window frame')
        .option('--padding <px>', 'Padding around window (default: 80)', parseInt)
        .option('--radius <px>', 'Window corner radius (default: 10)', parseInt)
        .option('--shadow', 'Add drop shadow to window')
        .option('--ai', 'Use DALL-E to generate background')
        .option('--prompt <text>', 'Prompt for AI background generation')
        .option('--list-themes', 'List available themes')
        .action(async (input, cmdOptions) => {
        if (cmdOptions.listThemes) {
            (0, themes_1.listThemes)();
            return;
        }
        if (!input) {
            console.error('❌ Error: missing input file. Usage: macshot <input.png>');
            process.exit(1);
        }
        const config = loadConfig();
        const options = {
            input,
            output: cmdOptions.output,
            theme: cmdOptions.theme ?? config.theme,
            dark: cmdOptions.dark ?? config.dark ?? false,
            title: cmdOptions.title ?? config.title,
            padding: cmdOptions.padding ?? config.padding,
            radius: cmdOptions.radius ?? config.radius,
            shadow: cmdOptions.shadow ?? config.shadow ?? false,
            ai: cmdOptions.ai,
            prompt: cmdOptions.prompt,
            apiKey: config.apiKey,
        };
        try {
            const outputPath = await (0, compose_1.compose)(options);
            console.log(`✅ Saved: ${outputPath}`);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`❌ Error: ${message}`);
            process.exit(1);
        }
    });
    program.parse();
}
