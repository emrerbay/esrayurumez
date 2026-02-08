import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "h1", "h2", "h3", "h4", "p", "br", "strong", "em", "u", "ul", "ol", "li",
  "a", "blockquote", "div", "span", "table", "thead", "tbody", "tr", "th", "td",
];

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      div: ["class"],
      span: ["class"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}
