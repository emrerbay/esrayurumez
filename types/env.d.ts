/**
 * Node.js modülleri için minimal tip tanımları.
 * Tam tanımlar için: npm i -D @types/node
 */
declare module "path" {
  export function join(...paths: string[]): string;
  export function basename(p: string, ext?: string): string;
  export function extname(p: string): string;
  export const sep: string;
  export const delimiter: string;
}

declare module "fs" {
  export function existsSync(path: string): boolean;
  export function readFileSync(path: string): Buffer;
  export function readdirSync(path: string): string[];
  export function writeFileSync(path: string, data: Buffer | string): void;
  export function mkdirSync(path: string, options?: { recursive?: boolean }): void;
}

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
  }
}

declare var process: {
  cwd(): string;
  env: NodeJS.ProcessEnv;
};

declare module "sanitize-html" {
  function sanitizeHtml(html: string, options?: Record<string, unknown>): string;
  export default sanitizeHtml;
}

declare module "mammoth" {
  export interface ConvertToHtmlOptions {
    styleMap?: string[];
  }
  export function convertToHtml(
    input: { buffer: Buffer },
    options?: ConvertToHtmlOptions
  ): Promise<{ value: string; messages: Array<{ type: string }> }>;
}

/** Next.js - tam tipler için: npm install */
declare module "next" {
  export interface Metadata {
    title?: string | { default: string; template: string };
    description?: string;
    keywords?: string[] | string;
    authors?: Array<{ name: string }>;
    openGraph?: {
      type?: string;
      locale?: string;
      title?: string;
      description?: string;
    };
  }
  export namespace MetadataRoute {
    export interface Robots {
      rules?: Array<{ userAgent: string; allow?: string; disallow?: string[] }>;
      sitemap?: string;
    }
    export interface Sitemap {
      url: string;
      lastModified?: string | Date;
      changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
      priority?: number;
    }
  }
  export default function (props: { children: React.ReactNode }): React.ReactElement;
}

declare module "next/link" {
  export interface LinkProps {
    href: string;
    children?: unknown;
    className?: string;
    onClick?: () => void;
    target?: string;
    rel?: string;
  }
  const Link: (props: LinkProps) => any;
  export default Link;
}

declare module "next/image" {
  export interface ImageProps {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    sizes?: string;
    priority?: boolean;
    unoptimized?: boolean;
  }
  const Image: (props: ImageProps) => any;
  export default Image;
}

declare module "next/navigation" {
  export function usePathname(): string;
  export function useRouter(): { push: (url: string) => void; refresh: () => void };
  export function redirect(url: string): never;
  export function notFound(): never;
}

declare namespace React {
  interface ReactElement {}
  interface ReactNode {}
  interface FormEvent<T = unknown> {
    preventDefault(): void;
    target: T;
  }
  interface ChangeEvent<T = unknown> {
    target: T & { value: string };
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
}
