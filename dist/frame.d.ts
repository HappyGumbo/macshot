export interface FrameOptions {
    width: number;
    height: number;
    radius: number;
    dark: boolean;
    title?: string;
    shadow: boolean;
}
export declare function generateFrameSvg(options: FrameOptions): string;
export declare function getTitleBarHeight(): number;
