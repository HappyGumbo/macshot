"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAiBackground = generateAiBackground;
const sharp_1 = __importDefault(require("sharp"));
const openai_1 = __importDefault(require("openai"));
async function generateAiBackground(width, height, prompt, apiKey) {
    const key = apiKey || process.env.OPENAI_API_KEY;
    if (!key) {
        throw new Error('OPENAI_API_KEY is required for AI backgrounds.\n' +
            'Set it via environment variable or in ~/.macshot.json');
    }
    const openai = new openai_1.default({ apiKey: key });
    const defaultPrompt = 'A beautiful abstract gradient background for a macOS desktop wallpaper, smooth color transitions, high quality, no text, no objects';
    const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: prompt || defaultPrompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
        response_format: 'url',
    });
    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
        throw new Error('Failed to generate AI background: no image URL returned');
    }
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
        throw new Error(`Failed to download AI background: ${imageResp.statusText}`);
    }
    const buffer = Buffer.from(await imageResp.arrayBuffer());
    return (0, sharp_1.default)(buffer).resize(width, height, { fit: 'cover' });
}
