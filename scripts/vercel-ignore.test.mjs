#!/usr/bin/env node
/**
 * Tests for scripts/vercel-ignore.sh, the Vercel Ignored Build Step.
 *
 * Each test builds a throwaway repo, clones it the way Vercel does
 * (`git clone --depth=10`), sets VERCEL_GIT_PREVIOUS_SHA and runs the real
 * script in the clone. Exit 0 = Vercel skips the deployment, 1 = it builds.
 *
 * Usage: node --test scripts/vercel-ignore.test.mjs   (needs git on PATH)
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT = resolve(dirname(fileURLToPath(import.meta.url)), "vercel-ignore.sh");
const SKIP = 0;
const BUILD = 1;

const gitEnv = {
  ...process.env,
  GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@t", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@t",
  GIT_CONFIG_GLOBAL: "/dev/null", GIT_CONFIG_NOSYSTEM: "1",
};
const git = (cwd, ...args) => execFileSync("git", args, { cwd, env: gitEnv, encoding: "utf8" }).trim();

/** A repo shaped like this one, with one commit. Returns helpers to grow it. */
function makeOrigin(t) {
  const root = mkdtempSync(join(tmpdir(), "vercel-ignore-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const origin = join(root, "origin");
  mkdirSync(origin);
  git(origin, "init", "-q", "-b", "main");
  const files = {
    "index.html": "<p>home</p>\n", "privacy.md": "privacy\n", "_config.yml": "title: x\n",
    "vercel.json": "{}\n", "landing/lp-shared.js": "1\n", "README.md": "readme\n",
    ".github/workflows/landing.yml": "on: push\n", "scripts/check-landing.mjs": "//\n",
  };
  for (const [f, body] of Object.entries(files)) write(f, body);
  commit("initial");

  function write(f, body) {
    mkdirSync(dirname(join(origin, f)), { recursive: true });
    writeFileSync(join(origin, f), body);
  }
  function commit(msg) {
    git(origin, "add", "-A");
    git(origin, "commit", "-q", "-m", msg);
    return git(origin, "rev-parse", "HEAD");
  }
  /** Change `f`, commit, return the new sha. */
  function change(f, msg = `touch ${f}`) {
    write(f, `${msg} ${Math.random()}\n`);
    return commit(msg);
  }
  /** Clone the tip as Vercel does: a shallow clone, depth 10. */
  function vercelClone(depth = 10) {
    const dir = join(root, `clone-${Math.random().toString(36).slice(2)}`);
    git(root, "clone", "-q", `--depth=${depth}`, pathToFileURL(origin).href, dir);
    return dir;
  }
  return { origin, root, head: () => git(origin, "rev-parse", "HEAD"), change, commit, write, vercelClone };
}

/** Run the real script in `cwd` with VERCEL_GIT_PREVIOUS_SHA = `previous` (undefined = unset). */
function ignoreStep(cwd, previous) {
  const env = { ...gitEnv };
  delete env.VERCEL_GIT_PREVIOUS_SHA;
  if (previous !== undefined) env.VERCEL_GIT_PREVIOUS_SHA = previous;
  const r = spawnSync("sh", [SCRIPT], { cwd, env, encoding: "utf8" });
  return { code: r.status, out: r.stdout + r.stderr };
}

test("a push whose last commit only touches README.md still builds the site commit before it", (t) => {
  const repo = makeOrigin(t);
  const deployed = repo.head();
  repo.change("index.html");
  repo.change("README.md");
  const r = ignoreStep(repo.vercelClone(), deployed);
  assert.equal(r.code, BUILD, r.out);
  assert.match(r.out, /the site changed since/);
});

test("the same push skips when the site commit was already deployed", (t) => {
  const repo = makeOrigin(t);
  repo.change("index.html");
  const deployed = repo.head();
  repo.change("README.md");
  const r = ignoreStep(repo.vercelClone(), deployed);
  assert.equal(r.code, SKIP, r.out);
  assert.match(r.out, /skipping/);
});

for (const f of ["README.md", ".github/workflows/landing.yml", "scripts/check-landing.mjs"]) {
  test(`only ${f} changed since the last deployment: skip`, (t) => {
    const repo = makeOrigin(t);
    const deployed = repo.head();
    repo.change(f);
    repo.change(f, "again");
    const r = ignoreStep(repo.vercelClone(), deployed);
    assert.equal(r.code, SKIP, r.out);
  });
}

for (const f of ["index.html", "privacy.md", "_config.yml", "vercel.json", "landing/lp-shared.js", "landing/README.md", "Gemfile"]) {
  test(`${f} changed since the last deployment (then README.md): build`, (t) => {
    const repo = makeOrigin(t);
    const deployed = repo.head();
    repo.change(f);
    repo.change("README.md");
    const r = ignoreStep(repo.vercelClone(), deployed);
    assert.equal(r.code, BUILD, r.out);
  });
}

test("a site file deleted since the last deployment: build", (t) => {
  const repo = makeOrigin(t);
  const deployed = repo.head();
  rmSync(join(repo.origin, "privacy.md"));
  repo.commit("drop privacy");
  repo.change("README.md");
  const r = ignoreStep(repo.vercelClone(), deployed);
  assert.equal(r.code, BUILD, r.out);
});

test("no previous deployment on the branch (unset or empty): build", (t) => {
  const repo = makeOrigin(t);
  repo.change("README.md");
  const clone = repo.vercelClone();
  for (const previous of [undefined, ""]) {
    const r = ignoreStep(clone, previous);
    assert.equal(r.code, BUILD, `${JSON.stringify(previous)}: ${r.out}`);
    assert.match(r.out, /no previous deployment/);
  }
});

test("a redeploy of the last deployed commit builds, full or abbreviated sha", (t) => {
  const repo = makeOrigin(t);
  repo.change("README.md");
  const clone = repo.vercelClone();
  for (const previous of [repo.head(), repo.head().slice(0, 12)]) {
    const r = ignoreStep(clone, previous);
    assert.equal(r.code, BUILD, `${previous}: ${r.out}`);
    assert.match(r.out, /already the last deployment/);
  }
});

test("an abbreviated previous sha still skips a README-only change", (t) => {
  const repo = makeOrigin(t);
  const deployed = repo.head();
  repo.change("README.md");
  const r = ignoreStep(repo.vercelClone(), deployed.slice(0, 12));
  assert.equal(r.code, SKIP, r.out);
});

test("a previous deployment deeper than Vercel's depth-10 clone builds", (t) => {
  const repo = makeOrigin(t);
  const deployed = repo.head();
  for (let i = 0; i < 12; i++) repo.change("README.md", `readme ${i}`);
  // Premise: with the history present, these README-only commits skip.
  assert.equal(ignoreStep(repo.vercelClone(50), deployed).code, SKIP);
  const r = ignoreStep(repo.vercelClone(), deployed);
  assert.equal(r.code, BUILD, r.out);
  assert.match(r.out, /not in the clone/);
});

test("a previous sha that is not a commit builds", (t) => {
  const repo = makeOrigin(t);
  repo.change("README.md");
  const clone = repo.vercelClone();
  for (const previous of ["not-a-sha", "0".repeat(40), git(clone, "rev-parse", "HEAD^{tree}")]) {
    const r = ignoreStep(clone, previous);
    assert.equal(r.code, BUILD, `${previous}: ${r.out}`);
    assert.match(r.out, /not in the clone/);
  }
});

test("outside a git checkout it builds", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "vercel-ignore-nogit-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const r = spawnSync("sh", [SCRIPT], {
    cwd: dir, encoding: "utf8",
    env: { ...gitEnv, VERCEL_GIT_PREVIOUS_SHA: "a".repeat(40), GIT_CEILING_DIRECTORIES: dirname(dir) },
  });
  assert.equal(r.status, BUILD, r.stdout + r.stderr);
  assert.match(r.stdout, /cannot read HEAD/);
});
