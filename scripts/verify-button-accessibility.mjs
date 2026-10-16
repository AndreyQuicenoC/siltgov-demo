/**
 * Ensures every native <button> in src has an accessible name (aria-label, title, or visible text).
 * Icon-only controls should also expose Radix tooltips via shared components in runtime.
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("src");
const BUTTON_OPEN = /<button\b/gi;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|jsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
}

function hasAccessibleName(buttonBlock) {
  if (/\baria-label\s*=/.test(buttonBlock)) return true;
  if (/\btitle\s*=/.test(buttonBlock)) return true;
  if (/\baria-labelledby\s*=/.test(buttonBlock)) return true;
  const inner = buttonBlock.replace(/^<button[^>]*>/i, "").replace(/<\/button>\s*$/i, "");
  const text = inner.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 0;
}

const violations = [];

for (const file of walk(SRC)) {
  const raw = fs.readFileSync(file, "utf8");
  const source = stripComments(raw);
  let match;
  while ((match = BUTTON_OPEN.exec(source)) !== null) {
    const start = match.index;
    const end = source.indexOf("</button>", start);
    if (end === -1) continue;
    const block = source.slice(start, end + "</button>".length);
    if (!hasAccessibleName(block)) {
      const line = source.slice(0, start).split("\n").length;
      violations.push(`${path.relative(process.cwd(), file)}:${line}`);
    }
  }
}

if (violations.length) {
  console.error("Buttons without accessible name (aria-label, title, or visible text):");
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
}

console.log("All buttons include an accessible name.");
