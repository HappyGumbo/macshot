export interface ThemeGradientStop {
  offset: number;
  color: string;
  opacity?: number;
}

export interface Theme {
  name: string;
  description: string;
  stops: ThemeGradientStop[];
  angle?: number;
}

export const themes: Record<string, Theme> = {
  sonoma: {
    name: 'sonoma',
    description: 'macOS Sonoma — warm golden hour tones',
    angle: 135,
    stops: [
      { offset: 0, color: '#1a1a2e' },
      { offset: 0.2, color: '#16213e' },
      { offset: 0.4, color: '#0f3460' },
      { offset: 0.6, color: '#533483' },
      { offset: 0.8, color: '#e94560' },
      { offset: 1, color: '#f5a623' },
    ],
  },
  ventura: {
    name: 'ventura',
    description: 'macOS Ventura — deep ocean blues and teals',
    angle: 160,
    stops: [
      { offset: 0, color: '#0c0c1d' },
      { offset: 0.15, color: '#1a1a4e' },
      { offset: 0.35, color: '#1e3a5f' },
      { offset: 0.55, color: '#1a6b8a' },
      { offset: 0.75, color: '#2dd4bf' },
      { offset: 1, color: '#99f6e4' },
    ],
  },
  monterey: {
    name: 'monterey',
    description: 'macOS Monterey — rich purple and violet',
    angle: 140,
    stops: [
      { offset: 0, color: '#0f0c29' },
      { offset: 0.25, color: '#302b63' },
      { offset: 0.5, color: '#6441a5' },
      { offset: 0.75, color: '#8e44ad' },
      { offset: 1, color: '#c39bd3' },
    ],
  },
  sequoia: {
    name: 'sequoia',
    description: 'macOS Sequoia — forest green to sky blue',
    angle: 145,
    stops: [
      { offset: 0, color: '#0d1b2a' },
      { offset: 0.2, color: '#1b2838' },
      { offset: 0.4, color: '#1a5632' },
      { offset: 0.6, color: '#2d8659' },
      { offset: 0.8, color: '#52b788' },
      { offset: 1, color: '#b7e4c7' },
    ],
  },
  sunset: {
    name: 'sunset',
    description: 'Warm sunset — orange, pink, purple',
    angle: 135,
    stops: [
      { offset: 0, color: '#2d1b69' },
      { offset: 0.2, color: '#6b2fa0' },
      { offset: 0.4, color: '#c2185b' },
      { offset: 0.6, color: '#e65100' },
      { offset: 0.8, color: '#ff8f00' },
      { offset: 1, color: '#ffd54f' },
    ],
  },
  ocean: {
    name: 'ocean',
    description: 'Deep ocean — dark blue to aqua',
    angle: 180,
    stops: [
      { offset: 0, color: '#000428' },
      { offset: 0.25, color: '#004e92' },
      { offset: 0.5, color: '#0077b6' },
      { offset: 0.75, color: '#00b4d8' },
      { offset: 1, color: '#90e0ef' },
    ],
  },
  aurora: {
    name: 'aurora',
    description: 'Northern lights — green, teal, purple',
    angle: 150,
    stops: [
      { offset: 0, color: '#0a0a23' },
      { offset: 0.15, color: '#1b1464' },
      { offset: 0.3, color: '#0d7377' },
      { offset: 0.5, color: '#14ffec' },
      { offset: 0.7, color: '#32cd32' },
      { offset: 0.85, color: '#7b2ff7' },
      { offset: 1, color: '#0d0221' },
    ],
  },
  lavender: {
    name: 'lavender',
    description: 'Soft lavender — purple to pink pastel',
    angle: 135,
    stops: [
      { offset: 0, color: '#2b1055' },
      { offset: 0.25, color: '#6a1b9a' },
      { offset: 0.5, color: '#ab47bc' },
      { offset: 0.75, color: '#ce93d8' },
      { offset: 1, color: '#f3e5f5' },
    ],
  },
};

export function getTheme(name: string): Theme {
  const theme = themes[name];
  if (!theme) {
    const available = Object.keys(themes).join(', ');
    throw new Error(`Unknown theme "${name}". Available themes: ${available}`);
  }
  return theme;
}

export function listThemes(): void {
  console.log('Available themes:\n');
  for (const t of Object.values(themes)) {
    console.log(`  ${t.name.padEnd(12)} ${t.description}`);
  }
}
