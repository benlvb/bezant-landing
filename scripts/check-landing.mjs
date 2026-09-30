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
 *   - JSON-LD SoftwareApplication on `/` and `/what-is-bezant/` via include (no AggregateRating)
 *   - JSON-LD FAQPage on `/support/` via include (12 citation Q&As)
 *   - sitemap.xml lists `/`, `/what-is-bezant/`, `/support/`, `/privacy/`
 *
 * Usage: node scripts/check-landing.mjs   (exit 0 = pass, 1 = fail)
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const pageDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = join(pageDir, "landing");

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
  .filter((m) => !/type\s*=\s*["']application\/ld\+json["']/i.test(m[0]))
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
const PUBLIC_PAGES = new Set(["index.html", "privacy.md", "support.md", "what-is-bezant.md", "sitemap.xml", "landing"]);
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

// 9. Public App Store CTA must be live — not a Coming soon placeholder.
if (/apps\.apple\.com\/app\/(?:bezant\/)?id6777883001/.test(html)) {
  ok("App Store listing URL (id 6777883001) is present");
} else {
  fail("index.html has no App Store listing URL (id 6777883001)");
}
if (/Coming soon/i.test(html)) fail("index.html still contains “Coming soon” copy");
else ok("no “Coming soon” copy on the landing page");
const storeHrefs = [...html.matchAll(/href\s*=\s*["']([^"']*apps\.apple\.com[^"']*)["']/gi)].map((m) => m[1]);
if (storeHrefs.length) ok(`App Store href(s): ${storeHrefs.join(", ")}`);
else fail("no App Store href on the landing page");

// 10. Citation pages, sitemap, and JSON-LD (SoftwareApplication / FAQPage).
const whatIs = readFileSync(join(pageDir, "what-is-bezant.md"), "utf8");
const support = readFileSync(join(pageDir, "support.md"), "utf8");
const softwareInc = readFileSync(join(pageDir, "_includes", "jsonld-software-application.html"), "utf8");
const faqInc = readFileSync(join(pageDir, "_includes", "jsonld-faqpage.html"), "utf8");
const sitemap = readFileSync(join(pageDir, "sitemap.xml"), "utf8");

if (/^---[\s\S]*layout:\s*page[\s\S]*permalink:\s*\/what-is-bezant\/[\s\S]*---/.test(whatIs)) {
  ok("what-is-bezant.md is layout: page at /what-is-bezant/");
} else {
  fail("what-is-bezant.md must use layout: page and permalink: /what-is-bezant/");
}
if (/^---[\s\S]*layout:\s*page[\s\S]*permalink:\s*\/support\/[\s\S]*---/.test(support)) {
  ok("support.md is layout: page at /support/");
} else {
  fail("support.md must use layout: page and permalink: /support/");
}

if (/{%\s*include\s+jsonld-software-application\.html\s*%}/.test(whatIs)) {
  ok("what-is-bezant.md includes SoftwareApplication JSON-LD");
} else {
  fail("what-is-bezant.md does not include jsonld-software-application.html");
}
if (/{%\s*include\s+jsonld-faqpage\.html\s*%}/.test(support)) {
  ok("support.md includes FAQPage JSON-LD");
} else {
  fail("support.md does not include jsonld-faqpage.html");
}

const ldJson = (src, label) => {
  const blocks = [...src.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((m, i) => {
      try { return JSON.parse(m[1]); }
      catch (e) { fail(`${label} JSON-LD #${i + 1} is not JSON: ${e.message}`); return null; }
    })
    .filter(Boolean);
  if (!blocks.length) fail(`${label} has no application/ld+json block`);
  return blocks;
};

const SOFTWARE_DESC = "Bezant is a private, on-device money app for iPhone and Apple Watch. Log spends in one tap, plan goals with real dates, and track trip expenses — no account, no bank linking.";
const checkSoftware = (obj, label) => {
  if (obj["@type"] !== "SoftwareApplication") fail(`${label}: @type is ${obj["@type"]}, expected SoftwareApplication`);
  else ok(`${label}: SoftwareApplication`);
  if (obj.name !== "Bezant") fail(`${label}: name is ${JSON.stringify(obj.name)}`);
  if (obj.operatingSystem !== "iOS 17+") fail(`${label}: operatingSystem is ${JSON.stringify(obj.operatingSystem)}`);
  if (obj.applicationCategory !== "FinanceApplication") fail(`${label}: applicationCategory is ${JSON.stringify(obj.applicationCategory)}`);
  if (obj.description !== SOFTWARE_DESC) fail(`${label}: description does not match the citation meta description`);
  if (obj.url !== "https://bezant.app/") fail(`${label}: url is ${JSON.stringify(obj.url)}`);
  if (obj.downloadUrl !== "https://apps.apple.com/app/id6777883001") fail(`${label}: downloadUrl is ${JSON.stringify(obj.downloadUrl)}`);
  const offers = obj.offers || {};
  if (String(offers.price) !== "0" || offers.priceCurrency !== "USD") {
    fail(`${label}: offers must be price 0 USD (got ${JSON.stringify(offers)})`);
  } else ok(`${label}: offers price 0 USD`);
  const author = obj.author || {};
  if (author["@type"] !== "Person" || author.name !== "Ben Liew" || author.email !== "ben@benliew.xyz") {
    fail(`${label}: author must be Person Ben Liew <ben@benliew.xyz> (got ${JSON.stringify(author)})`);
  } else ok(`${label}: author Ben Liew`);
  if (obj.aggregateRating || obj.AggregateRating) fail(`${label}: must not include AggregateRating`);
  else ok(`${label}: no AggregateRating`);
};

const homeLd = ldJson(html, "index.html");
const softwareLd = ldJson(softwareInc, "_includes/jsonld-software-application.html");
if (homeLd.length !== 1) fail(`index.html should have exactly one JSON-LD block (found ${homeLd.length})`);
if (softwareLd.length !== 1) fail(`software-application include should have exactly one JSON-LD block (found ${softwareLd.length})`);
if (homeLd[0]) checkSoftware(homeLd[0], "index.html");
if (softwareLd[0]) checkSoftware(softwareLd[0], "/what-is-bezant/ include");
if (homeLd[0] && softwareLd[0] && JSON.stringify(homeLd[0]) !== JSON.stringify(softwareLd[0])) {
  fail("index.html SoftwareApplication JSON-LD does not match _includes/jsonld-software-application.html");
} else if (homeLd[0] && softwareLd[0]) {
  ok("homepage and /what-is-bezant/ SoftwareApplication JSON-LD match");
}

const FAQ = [
  ["What is Bezant?", "A private, on-device money app for iPhone and Apple Watch. Plan goals, log expenses in one tap, and keep data on your device — no account required, no bank linking."],
  ["Does Bezant link to my bank?", "No. Manual-entry only."],
  ["Do I need an account?", "No. Bezant has no accounts, and you never need to sign in."],
  ["Where is my data stored?", "On iPhone by default. Optional iCloud = your CloudKit private DB; E2E needs Advanced Data Protection."],
  ["Is Bezant free?", "Yes. v1.0 free on the App Store."],
  ["Can I log expenses quickly?", "Yes — Quick Log, widgets, Siri, Watch; inbox until categorized."],
  ["What are streaks?", "Log a spend or $0 no-spend day for a daily flame; milestones 7/30/100."],
  ["Can I plan savings goals with dates?", "Yes; Top/Mid/Low; What-if on Home for funded-by dates."],
  ["Can I track a trip or overseas expenses?", "Yes; Events for time-bounded trip budgets + category logs; manual entry, no bank import."],
  ["Does Bezant work on Apple Watch?", "Yes — glance, complications, Digital Crown quick-log."],
  ["Which currencies?", "USD, MYR, EUR, SGD via ECB rates."],
  ["How do I get help?", "ben@benliew.xyz — see /support/."],
];
const faqLd = ldJson(faqInc, "_includes/jsonld-faqpage.html");
if (faqLd.length !== 1) fail(`FAQ include should have exactly one JSON-LD block (found ${faqLd.length})`);
else {
  const faq = faqLd[0];
  if (faq["@type"] !== "FAQPage") fail(`FAQ JSON-LD @type is ${faq["@type"]}, expected FAQPage`);
  else ok("FAQ JSON-LD is FAQPage");
  const entities = Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
  if (entities.length !== FAQ.length) fail(`FAQPage has ${entities.length} questions, expected ${FAQ.length}`);
  else ok(`FAQPage has ${FAQ.length} questions`);
  FAQ.forEach(([q, a], i) => {
    const ent = entities[i] || {};
    const text = ent.acceptedAnswer?.text;
    if (ent["@type"] !== "Question" || ent.name !== q || text !== a) {
      fail(`FAQ #${i + 1} mismatch: expected ${JSON.stringify(q)} / ${JSON.stringify(a)}, got ${JSON.stringify(ent.name)} / ${JSON.stringify(text)}`);
    }
  });
  if (!problems.some((p) => p.startsWith("FAQ #"))) ok("FAQPage Q&As match the citation copy");
  if (JSON.stringify(faq).includes("AggregateRating")) fail("FAQ JSON-LD must not include AggregateRating");
}

for (const loc of [
  "https://bezant.app/",
  "https://bezant.app/what-is-bezant/",
  "https://bezant.app/support/",
  "https://bezant.app/privacy/",
]) {
  if (sitemap.includes(`<loc>${loc}</loc>`)) ok(`sitemap includes ${loc}`);
  else fail(`sitemap.xml missing ${loc}`);
}

if (/\/what-is-bezant\//.test(html) && /\/support\//.test(html) && /apps\.apple\.com\/app\/id6777883001/.test(html)) {
  ok("homepage blurb links to /what-is-bezant/, /support/, and the App Store");
} else {
  fail("homepage is missing the citation blurb links (/what-is-bezant/, /support/, apps.apple.com/app/id6777883001)");
}

for (const heading of FAQ.map(([q]) => q)) {
  if (new RegExp(`^### ${heading.replace(/[?]/g, "\\?")}\\s*$`, "m").test(support)) ok(`support.md has visible Q: ${heading}`);
  else fail(`support.md is missing visible heading for ${JSON.stringify(heading)}`);
}
for (const howTo of [
  "How do I get started?",
  "How do I sync across devices?",
  "How do I import expenses from a spreadsheet?",
  "How do I back up?",
  "I deleted something by mistake.",
  "How do I hide amounts?",
  "PDF statements",
]) {
  if (support.includes(howTo)) ok(`support.md keeps how-to: ${howTo}`);
  else fail(`support.md dropped how-to detail: ${howTo}`);
}

const publicSrc = [html, whatIs, support, softwareInc, faqInc];
for (const src of publicSrc) {
  if (/AggregateRating/.test(src)) fail("public citation files must not include AggregateRating");
}

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
