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
export declare function compose(options: ComposeOptions): Promise<string>;
