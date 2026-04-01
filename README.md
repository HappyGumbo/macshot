# macshot - macOS Screenshot Decorator CLI

> 输入截图，输出 macOS 窗口风格的装饰图片

## 安装
```bash
npm install -g .
```

## 使用
```bash
# 基础用法
macshot input.png

# 指定背景主题
macshot input.png --theme sonoma

# 自定义标题
macshot input.png --title "My App"

# 暗色模式
macshot input.png --dark

# AI 生成背景（需要 OPENAI_API_KEY）
macshot input.png --ai --prompt "ocean sunset"

# 调整参数
macshot input.png --padding 80 --radius 12 --shadow

# 列出主题
macshot --list-themes

# 指定输出路径
macshot input.png -o output.png
```

## 主题
- sonoma — macOS Sonoma 紫蓝渐变
- ventura — macOS Ventura 橙蓝渐变
- monterey — macOS Monterey 蓝紫渐变
- sequoia — macOS Sequoia 青绿渐变
- sunset — 日落橙红渐变
- ocean — 深海蓝绿渐变
- aurora — 极光紫绿渐变
- lavender — 薰衣草紫粉渐变

## 配置
创建 `~/.macshot.json`：
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
