import mammoth from "mammoth";
import path from "path";
import fs from "fs";
import { sanitize } from "./sanitize";

export interface DocxParseResult {
  html: string;
  title?: string;
  firstImageBuffer?: Buffer;
}

/**
 * Parse docx file to HTML using mammoth. Sanitizes output.
 */
export async function parseDocxToHtml(filePath: string): Promise<DocxParseResult> {
  const buf = fs.readFileSync(filePath);
  const result = await mammoth.convertToHtml(
    { buffer: buf },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h2:fresh",
        "p[style-name='Heading 2'] => h3:fresh",
        "p[style-name='Heading 3'] => h4:fresh",
      ],
    }
  );
  const html = sanitize(result.value);
  const title = result.messages.some((m) => m.type === "warning") ? undefined : undefined;
  return { html, title };
}

/**
 * Extract title from filename (without extension).
 */
export function titleFromFilename(filename: string): string {
  return filename.replace(/\.(docx|doc|pages)$/i, "").trim();
}

/**
 * Get list of .docx files in a directory.
 */
export function getDocxFilesInDir(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath);
  return files
    .filter((f) => /\.docx$/i.test(f))
    .map((f) => path.join(dirPath, f));
}
