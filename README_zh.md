# 🖼️ macshot

CLI 工具，为截图添加 macOS 窗口风格的装饰边框。

[English](./README.md) | **中文**

## 安装

```bash
npm install -g macshot
```

## 使用

### 基础用法

```bash
macshot screenshot.png
```

### 带参数

```bash
# 选择背景主题
macshot screenshot.png --theme sonoma

# 添加窗口标题
macshot screenshot.png --title "我的应用"

# 暗色模式
macshot screenshot.png --dark

# 自定义间距、圆角和阴影
macshot screenshot.png --padding 80 --radius 12 --shadow

# 指定输出路径
macshot screenshot.png -o output.png
```

### AI 生成背景（需要 OpenAI API Key）

```bash
# 使用 DALL-E 生成独特背景
macshot screenshot.png --ai

# 自定义提示词
macshot screenshot.png --ai --prompt "黄金时刻的海边日落"
```

在 `~/.macshot.json` 中设置 API Key：

```json
{
  "openaiApiKey": "sk-..."
}
```

也可以使用 `OPENAI_API_KEY` 环境变量。

## 主题

| 主题 | 描述 |
|------|------|
| `sonoma` | macOS Sonoma — 暖色金调 |
| `ventura` | macOS Ventura — 深海蓝绿 |
| `monterey` | macOS Monterey — 丰富紫罗兰 |
| `sequoia` | macOS Sequoia — 森林绿到天蓝 |
| `sunset` | 日落 — 橙粉紫渐变 |
| `ocean` | 深海 — 深蓝到水绿 |
| `aurora` | 极光 — 绿、青、紫 |
| `lavender` | 薰衣草 — 紫粉柔和渐变 |

查看所有主题：

```bash
macshot --list-themes
```

## 配置

创建 `~/.macshot.json` 设置默认值：

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

CLI 参数始终覆盖配置文件中的值。

## 参数说明

| 参数 | 默认值 | 描述 |
|------|--------|------|
| `-o, --output <path>` | `<输入文件名>-macshot.png` | 输出文件路径 |
| `-t, --theme <name>` | `sonoma` | 背景主题 |
| `--title <text>` | — | 窗口标题栏文字 |
| `--dark` | `false` | 暗色模式窗口 |
| `--padding <px>` | `80` | 窗口周围间距 |
| `--radius <px>` | `10` | 窗口圆角半径 |
| `--shadow` | `false` | 添加投影 |
| `--ai` | `false` | 使用 DALL-E 生成背景 |
| `--prompt <text>` | `"abstract gradient background"` | AI 背景提示词 |
| `--list-themes` | — | 列出所有可用主题 |

## 许可证

MIT
