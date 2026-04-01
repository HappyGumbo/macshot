const TRAFFIC_LIGHT_RADIUS = 6;
const TRAFFIC_LIGHT_SPACING = 8;
const TRAFFIC_LIGHT_MARGIN_LEFT = 14;
const TRAFFIC_LIGHT_MARGIN_TOP = 13;
const TITLE_BAR_HEIGHT = 38;

const COLORS = {
  red: '#FF5F57',
  yellow: '#FEBC2E',
  green: '#28C840',
  lightTitleBar: '#E8E8E8',
  darkTitleBar: '#2D2D2D',
  lightTitleText: '#333333',
  darkTitleText: '#E0E0E0',
  lightBorder: '#D0D0D0',
  darkBorder: '#1A1A1A',
  lightBody: '#FFFFFF',
  darkBody: '#1E1E1E',
};

export interface FrameOptions {
  width: number;
  height: number;
  radius: number;
  dark: boolean;
  title?: string;
  shadow: boolean;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateTitle(title: string, maxWidth: number, fontSize: number): string {
  const charWidth = fontSize * 0.55;
  const maxChars = Math.floor(maxWidth / charWidth);
  if (title.length <= maxChars) return title;
  return title.slice(0, maxChars - 1) + '…';
}

export function generateFrameSvg(options: FrameOptions): string {
  const { width, height, radius, dark, title, shadow } = options;

  const titleBarBg = dark ? COLORS.darkTitleBar : COLORS.lightTitleBar;
  const bodyBg = dark ? COLORS.darkBody : COLORS.lightBody;
  const borderColor = dark ? COLORS.darkBorder : COLORS.lightBorder;
  const titleColor = dark ? COLORS.darkTitleText : COLORS.lightTitleText;

  const outerR = Math.min(radius, width / 2, height / 2);

  // Shadow filter
  const shadowDef = shadow
    ? `
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>`
    : '';

  const shadowRef = shadow ? ' filter="url(#shadow)"' : '';

  // Traffic lights
  const cy = TRAFFIC_LIGHT_MARGIN_TOP + TRAFFIC_LIGHT_RADIUS;
  const redCx = TRAFFIC_LIGHT_MARGIN_LEFT + TRAFFIC_LIGHT_RADIUS;
  const yellowCx = redCx + TRAFFIC_LIGHT_RADIUS * 2 + TRAFFIC_LIGHT_SPACING;
  const greenCx = yellowCx + TRAFFIC_LIGHT_RADIUS * 2 + TRAFFIC_LIGHT_SPACING;

  const trafficLights = `
    <circle cx="${redCx}" cy="${cy}" r="${TRAFFIC_LIGHT_RADIUS}" fill="${COLORS.red}" />
    <circle cx="${yellowCx}" cy="${cy}" r="${TRAFFIC_LIGHT_RADIUS}" fill="${COLORS.yellow}" />
    <circle cx="${greenCx}" cy="${cy}" r="${TRAFFIC_LIGHT_RADIUS}" fill="${COLORS.green}" />`;

  // Title text — centered in title bar, offset right to not overlap traffic lights
  const titleStartX = greenCx + TRAFFIC_LIGHT_RADIUS + 12;
  const titleEndX = width - 14;
  const titleMaxWidth = titleEndX - titleStartX;
  let titleSvg = '';
  if (title && titleMaxWidth > 20) {
    const truncated = truncateTitle(title, titleMaxWidth, 13);
    const textX = titleStartX + titleMaxWidth / 2;
    titleSvg = `\n    <text x="${textX}" y="${TITLE_BAR_HEIGHT / 2 + 4.5}" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif" font-size="13" font-weight="500" fill="${titleColor}">${escapeXml(truncated)}</text>`;
  }

  // Build window shape — using clip path for rounded corners
  // Title bar: top portion with top-rounded corners
  // Body: bottom portion with bottom-rounded corners (transparent for screenshot)

  // Outer window border
  const windowShape = `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="${outerR}" ry="${outerR}" fill="none" stroke="${borderColor}" stroke-width="1" />`;

  // Title bar background — clipped to top rounded rect
  const titleBarClipPath = `
  <clipPath id="titleClip">
    <rect x="0" y="0" width="${width}" height="${TITLE_BAR_HEIGHT}" rx="${outerR}" ry="${outerR}" />
  </clipPath>
  <clipPath id="titleClipInner">
    <rect x="0" y="0" width="${width}" height="${TITLE_BAR_HEIGHT + 2}" />
  </clipPath>`;

  const titleBarRect = `<rect x="0" y="0" width="${width}" height="${TITLE_BAR_HEIGHT + 1}" fill="${titleBarBg}" clip-path="url(#titleClipInner)" />`;

  // Bottom rounded clip for the window border at bottom corners
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  ${shadowDef}
  <g${shadowRef}>
    <rect x="0" y="0" width="${width}" height="${height}" rx="${outerR}" ry="${outerR}" fill="${bodyBg}" />
    <defs>
      ${titleBarClipPath}
    </defs>
    ${titleBarRect}
    ${trafficLights}${titleSvg}
    ${windowShape}
  </g>
</svg>`;
}

export function getTitleBarHeight(): number {
  return TITLE_BAR_HEIGHT;
}
