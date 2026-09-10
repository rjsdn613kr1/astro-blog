import type { CollectionEntry } from "astro:content";
import { posix } from "node:path";
import { getPath } from "./getPath";

const localImages = import.meta.glob<string>(
  "/src/**/*.{png,jpg,jpeg,gif,webp,avif,svg}",
  { eager: true, query: "?url", import: "default" }
);
const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function getPostImage(post: CollectionEntry<"blog">) {
  const og = post.data.ogImage;
  const fallback = og
    ? typeof og === "string" ? og : og.src
    : `${base}${getPath(post.id, post.filePath)}/index.png`;
  // Code examples and comments are not article images.
  const body = (post.body ?? "")
    .replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[^\n]*$/gm, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const images = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["'][^>]*>|!\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s]+?))(?:\s+["'][^"']*["'])?\s*\)/gi;
  for (const match of body.matchAll(images)) {
    const raw = (match[1] ?? match[2] ?? match[3]).replace(/&amp;/g, "&");
    if (/^https?:\/\//i.test(raw)) {
      if (/(?:youtube\.com|youtu\.be)/i.test(new URL(raw).hostname)) continue;
      return { src: raw, fallback };
    }
    if (raw.startsWith("//")) return { src: `https:${raw}`, fallback };
    let decoded: string;
    try { decoded = decodeURIComponent(raw); } catch { continue; }
    const local = decoded.startsWith("@/")
      ? `/src/${decoded.slice(2)}`
      : posix.resolve("/", posix.dirname(post.filePath ?? "src/data/blog/post.md"), decoded);
    if (localImages[local]) return { src: localImages[local], fallback };
    if (raw.startsWith("/") && !raw.startsWith("/src/")) {
      return { src: raw.startsWith(`${base}/`) ? raw : `${base}${raw}`, fallback };
    }
  }
  return { src: fallback, fallback };
}
