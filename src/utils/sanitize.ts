
import sanitizeHtml from "sanitize-html";

export const sanitizeString = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, "") // Remove angle brackets
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, "") // Remove event handlers
        .replace(/script/gi, "") // Remove script keyword
        .slice(0, 255); // Limit length
};



export const sanitizeRichText = (html: string): string => {
  if (typeof html !== "string") return "";

  return sanitizeHtml(html, {
    allowedTags: [
      "b", "i", "u", "strong", "em",
      "p", "br", "ul", "ol", "li",
      "a"
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  }).trim();
};

export const sanitizeBody = (body: Record<string, any>) => {
    const out: Record<string, any> = {};
    for (const key of Object.keys(body || {})) {
        const value = body[key];
        out[key] = typeof value === "string" ? sanitizeString(value) : value;
    }
    return out;
};



export const sanitizeNumber = (value: any): number | null => {
  if (value === undefined || value === null) return null;

  const cleaned = String(value).replace(/[^\d.]/g, ""); // keep only digits

  const num = Number(cleaned);

  return Number.isFinite(num) ? num : null;
};

