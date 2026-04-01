import sharp from 'sharp';
import { existsSync } from 'fs';
import { basename, resolve } from 'path';
import { getTheme } from './themes';
import { createGradientBackground } from './backgrounds';
import { generateFrameSvg, getTitleBarHeight } from './frame';
import { generateAiBackground } from './ai-bg';

export interface ComposeOptions {
  input: string;
  output?: string;
  theme?: string;
  dark?: boolean;
  title?: string;
  padding?: number;
  radius?: number;
  shadow?: boolean;
  ai?: boolean;
  prompt?: string;
  apiKey?: string;
}

export async function compose(options: ComposeOptions): Promise<string> {
  const inputPath = resolve(options.input);
  if (!existsSync(inputPath)) {
    throw new Error(`File not found: ${inputPath}`);
  }

  // Get screenshot metadata
  let screenshotMeta: sharp.Metadata;
  try {
    screenshotMeta = await sharp(inputPath).metadata();
  } catch {
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
  const titleBarHeight = getTitleBarHeight();

  // Window dimensions: screenshot + title bar
  const windowWidth = screenshotWidth;
  const windowHeight = screenshotHeight + titleBarHeight;

  // Canvas dimensions: window + padding
  const canvasWidth = windowWidth + padding * 2;
  const canvasHeight = windowHeight + padding * 2;

  // 1. Create background
  let background: sharp.Sharp;
  if (options.ai) {
    background = await generateAiBackground(
      canvasWidth,
      canvasHeight,
      options.prompt,
      options.apiKey
    );
  } else {
    const theme = getTheme(themeName);
    background = await createGradientBackground(theme, canvasWidth, canvasHeight);
  }

  // 2. Generate window frame SVG (includes title bar + border + traffic lights)
  const frameSvg = generateFrameSvg({
    width: windowWidth,
    height: windowHeight,
    radius,
    dark,
    title: options.title,
    shadow,
  });

  // 3. Composite: background -> window frame overlay -> screenshot
  const frameBuffer = await sharp(Buffer.from(frameSvg))
    .resize(windowWidth, windowHeight)
    .png()
    .toBuffer();

  const screenshotBuffer = await sharp(inputPath)
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
  const outputPath =
    options.output ||
    resolve(
      process.cwd(),
      basename(inputPath, `.${basename(inputPath).split('.').pop()}`) +
        '-macshot.png'
    );

  await sharp(result).toFile(outputPath);
  return outputPath;
}
