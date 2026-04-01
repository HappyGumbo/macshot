import sharp from 'sharp';
import OpenAI from 'openai';

export async function generateAiBackground(
  width: number,
  height: number,
  prompt?: string,
  apiKey?: string
): Promise<sharp.Sharp> {
  const key = apiKey || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is required for AI backgrounds.\n' +
        'Set it via environment variable or in ~/.macshot.json'
    );
  }

  const openai = new OpenAI({ apiKey: key });
  const defaultPrompt =
    'A beautiful abstract gradient background for a macOS desktop wallpaper, smooth color transitions, high quality, no text, no objects';

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
  return sharp(buffer).resize(width, height, { fit: 'cover' });
}
