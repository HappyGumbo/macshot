"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGradientBackground = createGradientBackground;
const sharp_1 = __importDefault(require("sharp"));
function gradientToSvg(theme, width, height) {
    const angle = theme.angle ?? 135;
    const rad = (angle * Math.PI) / 180;
    const cx = width / 2;
    const cy = height / 2;
    const len = Math.sqrt(width * width + height * height) / 2;
    const x1 = cx - Math.sin(rad) * len;
    const y1 = cy + Math.cos(rad) * len;
    const x2 = cx + Math.sin(rad) * len;
    const y2 = cy - Math.cos(rad) * len;
    const stops = theme.stops
        .map((s) => `    <stop offset="${s.offset * 100}%" stop-color="${s.color}"${s.opacity !== undefined ? ` stop-opacity="${s.opacity}"` : ''} />`)
        .join('\n');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="userSpaceOnUse">
${stops}
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)" />
</svg>`;
}
async function createGradientBackground(theme, width, height) {
    const svg = gradientToSvg(theme, width, height);
    return (0, sharp_1.default)(Buffer.from(svg)).png();
}
