#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "brand");

const colors = {
  bg: "#0a0a0a",
  card: "#111111",
  border: "#2a2a2a",
  text: "#f5f5f5",
  muted: "#a3a3a3",
};

function svg(content, width, height) {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title desc">
  <title id="title">GratisCode logo</title>
  <desc id="desc">A terminal-style greater-than prompt followed by Gr.</desc>
${content}
</svg>
`;
}

const mark = svg(`  <rect width="96" height="96" rx="22" fill="${colors.bg}"/>
  <rect x="1" y="1" width="94" height="94" rx="21" stroke="${colors.border}" stroke-width="2"/>
  <text x="48" y="59" text-anchor="middle" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" font-size="34" font-weight="800" letter-spacing="-2">
    <tspan fill="${colors.muted}">&gt;</tspan><tspan fill="${colors.text}">Gr</tspan>
  </text>`, 96, 96);

const wordmark = svg(`  <rect width="420" height="96" rx="22" fill="${colors.bg}"/>
  <rect x="1" y="1" width="418" height="94" rx="21" stroke="${colors.border}" stroke-width="2"/>
  <text x="32" y="59" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" font-size="34" font-weight="800" letter-spacing="-2">
    <tspan fill="${colors.muted}">&gt;</tspan><tspan fill="${colors.text}">Gr</tspan>
  </text>
  <text x="126" y="58" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="30" font-weight="700" letter-spacing="-0.8" fill="${colors.text}">GratisCode</text>`, 420, 96);

const social = svg(`  <rect width="1200" height="630" fill="${colors.bg}"/>
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="${colors.card}" stroke="${colors.border}" stroke-width="2"/>
  <text x="132" y="270" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace" font-size="96" font-weight="800" letter-spacing="-6">
    <tspan fill="${colors.muted}">&gt;</tspan><tspan fill="${colors.text}">Gr</tspan>
  </text>
  <text x="132" y="370" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="76" font-weight="750" letter-spacing="-2" fill="${colors.text}">GratisCode</text>
  <text x="132" y="432" font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="30" fill="${colors.muted}">Sponsored AI coding access for Indian builders.</text>`, 1200, 630);

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "logo-mark.svg"), mark);
await writeFile(path.join(outDir, "logo-wordmark.svg"), wordmark);
await writeFile(path.join(outDir, "social-card.svg"), social);

console.log("Generated logo assets in public/brand:");
console.log("- logo-mark.svg");
console.log("- logo-wordmark.svg");
console.log("- social-card.svg");
