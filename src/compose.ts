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
  const radius = options.radius ?? 16;
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

  // 3. Composite: background -> window frame overlay -> screenshot (clipped to window corners)
  const frameBuffer = await sharp(Buffer.from(frameSvg))
    .resize(windowWidth, windowHeight)
    .png()
    .toBuffer();

  // Create a rounded-rect clip SVG for the screenshot area
  const clipSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${windowWidth}" height="${windowHeight}">
  <defs>
    <clipPath id="winClip">
      <rect x="0" y="${titleBarHeight}" width="${windowWidth}" height="${windowHeight - titleBarHeight}" />
    </clipPath>
  </defs>
</svg>`;

  const screenshotBuffer = await sharp(inputPath)
    .resize(screenshotWidth, screenshotHeight)
    .png()
    .toBuffer();

  // Combine frame + screenshot into a single composited window with rounded corners
  const windowBuffer = await sharp(
    Buffer.alloc(windowWidth * windowHeight * 4),
    { raw: { width: windowWidth, height: windowHeight, channels: 4 } }
  )
    .composite([
      { input: frameBuffer, left: 0, top: 0 },
      { input: screenshotBuffer, left: 0, top: titleBarHeight },
    ])
    .png()
    .toBuffer();

  // Apply rounded corner mask to the entire window
  const roundedMask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${windowWidth}" height="${windowHeight}">
      <rect x="0" y="0" width="${windowWidth}" height="${windowHeight}" rx="${radius}" ry="${radius}" fill="white" />
    </svg>`
  );

  const maskedWindow = await sharp(windowBuffer)
    .composite([
      { input: roundedMask, blend: 'dest-in' },
    ])
    .png()
    .toBuffer();

  const result = await background
    .composite([
      // Window (frame + screenshot, with rounded corners)
      {
        input: maskedWindow,
        left: padding,
        top: padding,
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
