// tools/docscan.js
// Comando para ver la estructura de los acrhivos de mi proyecto y sus imports para sacar su respectiva documentacion
import fs from "fs";
import path from "path";

const ROOT = process.argv[2] || process.cwd();

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "target", "out",
  ".next", ".turbo", ".idea", ".vscode", "coverage"
]);

const ALLOWED_EXT = new Set([
  ".js", ".jsx", ".ts", ".tsx",
  ".java",
  ".json", ".md"
]);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(full, files);
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (ALLOWED_EXT.has(ext)) files.push(rel);
  }
  return files;
}

function makeTree(paths) {
  const root = {};
  for (const p of paths) {
    const parts = p.split(path.sep);
    let cur = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      cur[part] = cur[part] || (i === parts.length - 1 ? null : {});
      cur = cur[part] || cur;
    }
  }
  return root;
}

function renderTree(node, prefix = "") {
  const keys = Object.keys(node).sort();
  let out = "";
  keys.forEach((k, i) => {
    const last = i === keys.length - 1;
    out += `${prefix}${last ? "└── " : "├── "}${k}\n`;
    if (node[k] && typeof node[k] === "object") {
      out += renderTree(node[k], prefix + (last ? "    " : "│   "));
    }
  });
  return out;
}

function readSnippet(relPath) {
  const full = path.join(ROOT, relPath);
  const ext = path.extname(full).toLowerCase();
  let text = "";
  try {
    text = fs.readFileSync(full, "utf8");
  } catch {
    return null;
  }

  // Tomar solo una parte (para no hacer archivos gigantes)
  const head = text.split("\n").slice(0, 200).join("\n");

  // Heurísticas simples: imports/exports, clases, rutas express, etc.
  const lines = head.split("\n");
  const picked = lines.filter(l =>
    l.includes("import ") ||
    l.includes("export ") ||
    l.includes("module.exports") ||
    l.includes("class ") ||
    l.includes("app.get") || l.includes("app.post") ||
    l.includes("router.get") || l.includes("router.post") ||
    l.includes("@GetMapping") || l.includes("@PostMapping") ||
    l.includes("public class") ||
    l.includes("extends") ||
    l.includes("implements")
  ).slice(0, 80);

  return {
    relPath,
    ext,
    snippet: picked.join("\n")
  };
}

const files = walk(ROOT);
const tree = makeTree(files);

fs.writeFileSync(
  path.join(ROOT, "STRUCTURE.md"),
  `# Project Structure\n\n\`\`\`\n${renderTree(tree)}\`\`\`\n`,
  "utf8"
);

fs.writeFileSync(
  path.join(ROOT, "INDEX.json"),
  JSON.stringify({ root: ROOT, files }, null, 2),
  "utf8"
);

const snippets = files
  .map(f => readSnippet(f))
  .filter(Boolean);

let md = `# Code Snippets Index\n\n> Auto-generated\n\n`;
for (const s of snippets) {
  if (!s.snippet.trim()) continue;
  md += `## ${s.relPath}\n\n\`\`\`${s.ext.replace(".", "")}\n${s.snippet}\n\`\`\`\n\n`;
}
fs.writeFileSync(path.join(ROOT, "SNIPPETS.md"), md, "utf8");

console.log("✅ Generated: STRUCTURE.md, INDEX.json, SNIPPETS.md");
