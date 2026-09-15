#!/usr/bin/env node
/**
 * Validate the static landing page (index.html + landing/ assets)
 * without a browser.
 *
 * Fast guards that catch the ways this page can silently break:
 *   - the two JS payloads (lp-shared.js + index.html's inline IIFE) must parse
 *   - index.html must reference lp-shared.js by a path that actually resolves
 *   - no Jekyll/Liquid tokens ({{ or {%) — they'd be mangled on the Jekyll build
 *   - no YAML front matter — Jekyll only serves the file verbatim without it
 *   - favicon.svg must be present and look like an SVG
 *
 * Usage: node scripts/check-landing.mjs   (exit 0 = pass, 1 = fail)
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const pageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = join(pageDir, "landing");

// og-image.png is binary; the committed source is four base64 chunks so the
// file can travel through text-only GitHub APIs. Materialize before checks.
const pngPath = join(assetDir, "og-image.png");
const pngChunks = [1, 2, 3, 4, 5, 6].map((i) => join(assetDir, `og-image.png.b64.${i}`));
if (!existsSync(pngPath) && pngChunks.every((p) => existsSync(p))) {
  writeFileSync(pngPath, Buffer.from(pngChunks.map((p) => readFileSync(p, "utf8")).join(""), "base64"));
}

const problems = [];
const ok = (m) => console.log(`  ok  ${m}`);
const fail = (m) => { problems.push(m); console.log(`FAIL  ${m}`); };

// 1. Required files exist.
const required = [["index.html", pageDir], ["lp-shared.js", assetDir], ["favicon.svg", assetDir], ["og-image.png", assetDir]];
for (const [f, d] of required) {
  if (existsSync(join(d, f))) ok(`${f} present`);
  else fail(`${f} missing`);
}
if (problems.length) finish();

const html = readFileSync(join(pageDir, "index.html"), "utf8");
const shared = readFileSync(join(assetDir, "lp-shared.js"), "utf8");
const favicon = readFileSync(join(assetDir, "favicon.svg"), "utf8");

// 2. No front matter — Jekyll copies HTML verbatim only when it has none.
if (/^\s*---\s*$/m.test(html.split("\n")[0] ?? "")) fail("index.html starts with YAML front matter (Jekyll would process it)");
else ok("index.html has no front matter (served verbatim)");

// 3. No Liquid tokens that the Pages build would try to interpret.
for (const [name, src] of [["index.html", html], ["lp-shared.js", shared]]) {
  if (/\{\{|\{%/.test(src)) fail(`${name} contains a Liquid token ({{ or {%)`);
  else ok(`${name} has no Liquid tokens`);
}

// 4. The <script src="…"> the page loads must resolve on disk.
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]);
if (!srcs.length) fail("index.html loads no external <script> — expected lp-shared.js");
for (const s of srcs) {
  if (/^https?:|^\/\//i.test(s)) { fail(`index.html loads a remote script (${s}); landing page must be self-contained`); continue; }
  if (existsSync(join(pageDir, s))) ok(`script src resolves: ${s}`);
  else fail(`script src does not resolve: ${s}`);
}

// 4b. og:image / twitter:image meta references must resolve on disk (or be absolute URLs).
const ogRefs = (html.match(/<meta\b[^>]*>/gi) || [])
  .filter((m) => /\bproperty="og:image"|\bname="twitter:image"/i.test(m))
  .map((m) => (m.match(/\bcontent="([^"]+)"/i) || [])[1])
  .filter(Boolean);
if (!ogRefs.length) fail("no og:image / twitter:image meta found");
for (const ref of [...new Set(ogRefs)]) {
  if (/^https?:|^\/\//i.test(ref)) ok(`og image is an absolute URL: ${ref}`);
  else if (existsSync(join(pageDir, ref))) ok(`og image resolves: ${ref}`);
  else fail(`og image does not resolve: ${ref}`);
}

// 5. Both JS payloads must compile (syntax only — vm.Script does not execute).
const compile = (code, label) => {
  try { new vm.Script(code); ok(`${label} parses`); }
  catch (e) { fail(`${label} syntax error: ${e.message}`); }
};
compile(shared, "lp-shared.js");

const inline = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1]).filter((s) => s.trim());
if (!inline.length) fail("index.html has no inline <script> block");
inline.forEach((code, i) => compile(code, `index.html inline script #${i + 1}`));

// 6. The shared kit must expose window.LP (the page destructures it).
if (/window\.LP\s*=/.test(shared)) ok("lp-shared.js assigns window.LP");
else fail("lp-shared.js never assigns window.LP");

// 7. favicon sanity.
if (/<svg[\s>]/i.test(favicon)) ok("favicon.svg looks like an SVG");
else fail("favicon.svg is not an SVG");

// 8. Nothing extra is published.
//
// This repo IS the site root, so every file dropped here is served by default —
// including plain .md with no front matter. `exclude:` is a denylist, so the
// unsafe case is the one you forget. This inverts it: anything that isn't a
// known public page must be listed in exclude:.
const PUBLIC_PAGES = new Set(["index.html", "privacy.md", "support.md", "landing"]);
const PUBLIC_ASSETS = new Set(["favicon.svg", "lp-shared.js", "og-image.png", "og-card.html", "og-card.svg"]);

const config = readFileSync(join(pageDir, "_config.yml"), "utf8");
const excluded = new Set();
let inExclude = false;
for (const line of config.split("\n")) {
  if (/^exclude:\s*$/.test(line)) { inExclude = true; continue; }
  if (!inExclude) continue;
  if (/^\S/.test(line)) break;              // next top-level key ends the block
  const item = line.match(/^\s+-\s+(.+?)\s*$/);
  if (item) excluded.add(item[1]);
}
if (!excluded.size) fail("_config.yml has no parseable exclude: list");

for (const entry of readdirSync(pageDir)) {
  // Jekyll already ignores dotfiles and _-prefixed paths.
  if (entry.startsWith(".") || entry.startsWith("_")) continue;
  if (PUBLIC_PAGES.has(entry) || excluded.has(entry)) continue;
  fail(`${entry} would be published — add it to exclude: in _config.yml, or to PUBLIC_PAGES here if it is meant to be public`);
}
for (const entry of readdirSync(assetDir)) {
  if (entry.startsWith(".")) continue;
  if (PUBLIC_ASSETS.has(entry) || excluded.has(`landing/${entry}`)) continue;
  fail(`landing/${entry} would be published — add it to exclude: as landing/${entry}, or to PUBLIC_ASSETS here`);
}
if (!problems.length) ok("no extra files are reachable on the public site");

finish();

function finish() {
  console.log("");
  if (problems.length) {
    console.error(`landing check: ${problems.length} problem(s)`);
    process.exit(1);
  }
  console.log("landing check: all passed");
  process.exit(0);
}
