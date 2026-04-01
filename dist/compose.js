"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = compose;
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = require("fs");
const path_1 = require("path");
const themes_1 = require("./themes");
const backgrounds_1 = require("./backgrounds");
const frame_1 = require("./frame");
const ai_bg_1 = require("./ai-bg");
async function compose(options) {
    const inputPath = (0, path_1.resolve)(options.input);
    if (!(0, fs_1.existsSync)(inputPath)) {
        throw new Error(`File not found: ${inputPath}`);
    }
    // Get screenshot metadata
    let screenshotMeta;
    try {
        screenshotMeta = await (0, sharp_1.default)(inputPath).metadata();
    }
    catch {
        throw new Error(`Invalid or unsupported image: ${inputPath}`);
    }
    if (!screenshotMeta.width || !screenshotMeta.height) {
        throw new Error(`Could not determine image dimensions: ${inputPath}`);
    }
    const padding = options.padding ?? 80;
    const radius = options.radius ?? 10;
    const dark = options.dark ?? false;
    const shadow = options.shadow ?? false;
    const themeName = options.theme ?? 'sonoma';
    const screenshotWidth = screenshotMeta.width;
    const screenshotHeight = screenshotMeta.height;
    const titleBarHeight = (0, frame_1.getTitleBarHeight)();
    // Window dimensions: screenshot + title bar
    const windowWidth = screenshotWidth;
    const windowHeight = screenshotHeight + titleBarHeight;
    // Canvas dimensions: window + padding
    const canvasWidth = windowWidth + padding * 2;
    const canvasHeight = windowHeight + padding * 2;
    // 1. Create background
    let background;
    if (options.ai) {
        background = await (0, ai_bg_1.generateAiBackground)(canvasWidth, canvasHeight, options.prompt, options.apiKey);
    }
    else {
        const theme = (0, themes_1.getTheme)(themeName);
        background = await (0, backgrounds_1.createGradientBackground)(theme, canvasWidth, canvasHeight);
    }
    // 2. Generate window frame SVG (includes title bar + border + traffic lights)
    const frameSvg = (0, frame_1.generateFrameSvg)({
        width: windowWidth,
        height: windowHeight,
        radius,
        dark,
        title: options.title,
        shadow,
    });
    // 3. Composite: background -> window frame overlay -> screenshot
    const frameBuffer = await (0, sharp_1.default)(Buffer.from(frameSvg))
        .resize(windowWidth, windowHeight)
        .png()
        .toBuffer();
    const screenshotBuffer = await (0, sharp_1.default)(inputPath)
        .resize(screenshotWidth, screenshotHeight)
        .png()
        .toBuffer();
    const result = await background
        .composite([
        // Window frame (title bar + border)
        {
            input: frameBuffer,
            left: padding,
            top: padding,
        },
        // Screenshot content below title bar
        {
            input: screenshotBuffer,
            left: padding,
            top: padding + titleBarHeight,
        },
    ])
        .png()
        .toBuffer();
    // Write output
    const outputPath = options.output ||
        (0, path_1.resolve)(process.cwd(), (0, path_1.basename)(inputPath, `.${(0, path_1.basename)(inputPath).split('.').pop()}`) +
            '-macshot.png');
    await (0, sharp_1.default)(result).toFile(outputPath);
    return outputPath;
}
