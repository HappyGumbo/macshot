import { Command } from 'commander';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { homedir } from 'os';
import { compose, ComposeOptions } from './compose';
import { listThemes, themes } from './themes';

interface ConfigFile {
  theme?: string;
  padding?: number;
  radius?: number;
  dark?: boolean;
  shadow?: boolean;
  title?: string;
  apiKey?: string;
}

function loadConfig(): ConfigFile {
  const configPath = resolve(homedir(), '.macshot.json');
  if (!existsSync(configPath)) return {};
  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch {
    return {};
  }
}

export function run(): void {
  const program = new Command();

  program
    .name('macshot')
    .description('Decorate screenshots with macOS window frames')
    .version('1.0.0')
    .argument('[input]', 'Input screenshot file')
    .option('-o, --output <path>', 'Output file path')
    .option('-t, --theme <name>', `Background theme (${Object.keys(themes).join(', ')})`)
    .option('--title <text>', 'Window title bar text')
    .option('--dark', 'Dark mode window frame')
    .option('--padding <px>', 'Padding around window (default: 80)', parseInt)
    .option('--radius <px>', 'Window corner radius (default: 10)', parseInt)
    .option('--shadow', 'Add drop shadow to window')
    .option('--ai', 'Use DALL-E to generate background')
    .option('--prompt <text>', 'Prompt for AI background generation')
    .option('--list-themes', 'List available themes')
    .action(async (input: string | undefined, cmdOptions: Record<string, unknown>) => {
      if (cmdOptions.listThemes) {
        listThemes();
        return;
      }

      if (!input) {
        console.error('❌ Error: missing input file. Usage: macshot <input.png>');
        process.exit(1);
      }

      const config = loadConfig();

      const options: ComposeOptions = {
        input,
        output: cmdOptions.output as string | undefined,
        theme: (cmdOptions.theme as string) ?? config.theme,
        dark: (cmdOptions.dark as boolean) ?? config.dark ?? false,
        title: (cmdOptions.title as string) ?? config.title,
        padding: (cmdOptions.padding as number) ?? config.padding,
        radius: (cmdOptions.radius as number) ?? config.radius,
        shadow: (cmdOptions.shadow as boolean) ?? config.shadow ?? false,
        ai: cmdOptions.ai as boolean | undefined,
        prompt: cmdOptions.prompt as string | undefined,
        apiKey: config.apiKey,
      };

      try {
        const outputPath = await compose(options);
        console.log(`✅ Saved: ${outputPath}`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`❌ Error: ${message}`);
        process.exit(1);
      }
    });

  program.parse();
}
