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
export declare const themes: Record<string, Theme>;
export declare function getTheme(name: string): Theme;
export declare function listThemes(): void;
