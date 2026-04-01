# 🖼️ macshot

CLI tool to decorate screenshots with macOS window frames.

## Install

```bash
npm install -g macshot
```

## Usage

### Basic

```bash
macshot screenshot.png
```

### With Options

```bash
# Choose a background theme
macshot screenshot.png --theme sonoma

# Add window title
macshot screenshot.png --title "My App"

# Dark mode
macshot screenshot.png --dark

# Custom padding, corner radius, and shadow
macshot screenshot.png --padding 80 --radius 12 --shadow

# Specify output path
macshot screenshot.png -o output.png
```

### AI Background (requires OpenAI API key)

```bash
# Use DALL-E to generate a unique background
macshot screenshot.png --ai

# With a custom prompt
macshot screenshot.png --ai --prompt "ocean sunset at golden hour"
```

Set your API key in `~/.macshot.json`:

```json
{
  "openaiApiKey": "sk-..."
}
```

Or use the `OPENAI_API_KEY` environment variable.

## Themes

| Theme | Description |
|-------|-------------|
| `sonoma` | macOS Sonoma — warm golden hour tones |
| `ventura` | macOS Ventura — deep ocean blues and teals |
| `monterey` | macOS Monterey — rich purple and violet |
| `sequoia` | macOS Sequoia — forest green to sky blue |
| `sunset` | Warm sunset — orange, pink, purple |
| `ocean` | Deep ocean — dark blue to aqua |
| `aurora` | Northern lights — green, teal, purple |
| `lavender` | Soft lavender — purple to pink pastel |

List all themes:

```bash
macshot --list-themes
```

## Configuration

Create `~/.macshot.json` to set defaults:

```json
{
  "theme": "sonoma",
  "padding": 80,
  "radius": 10,
  "dark": false,
  "shadow": true,
  "openaiApiKey": "sk-..."
}
```

CLI flags always override config file values.

## Options

| Flag | Default | Description |
|------|---------|-------------|
| `-o, --output <path>` | `<input>-macshot.png` | Output file path |
| `-t, --theme <name>` | `sonoma` | Background theme |
| `--title <text>` | — | Window title bar text |
| `--dark` | `false` | Dark mode window frame |
| `--padding <px>` | `80` | Padding around window |
| `--radius <px>` | `10` | Window corner radius |
| `--shadow` | `false` | Add drop shadow |
| `--ai` | `false` | Use DALL-E for background |
| `--prompt <text>` | `"abstract gradient background"` | AI background prompt |
| `--list-themes` | — | List available themes |

## License

MIT
