/** Plain-text preview from the article body, independent of description. */
export function getPostExcerpt(body = "", limit = 180): string {
  const text = body
    .replace(/<!--[^]*?-->/g, " ")
    .replace(/^(`{3,}|~{3,})[^\n]*\n[^]*?^\1[^\n]*$/gm, " ")
    .replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, " ")
    .replace(/!\[\[[^\]]*\]\]/g, " ")
    .replace(/!\[[^\]]*\]\([^\n]*?\)/g, " ")
    .replace(/!\[[^\]]*\]\[[^\]]*\]/g, " ")
    .replace(/^\s*\[[^\]]+\]:.*$/gm, " ")
    .replace(/\[([^\]]+)\]\([^\n]*?\)/g, "$1")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/^\s*(?:#{1,6}\s+|>\s*|[-+*]\s+|\d+\.\s+)/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, " ")
    .replace(/[*_`~]/g, "")
    .replace(/[\u200b\uFEFF]/g, "")
    .replace(/\s+/g, " ").trim();
  return text.length > limit ? text.slice(0, limit).trimEnd() + "…" : text;
}
