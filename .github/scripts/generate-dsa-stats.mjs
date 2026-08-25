#!/usr/bin/env node
/**
 * Walks this repo's own solution directories and computes real counts —
 * no live API calls, no fabricated numbers. Run by
 * .github/workflows/update-stats.yml whenever solutions change.
 *
 * LeetCode solutions (added by the LeetHub browser extension) land as
 * numbered folders at the repo root, e.g. `0012-integer-to-roman/`, each
 * with a README.md whose second line is `<h3>Easy|Medium|Hard</h3>`.
 * GeeksforGeeks solutions (added by this repo's custom sync extension)
 * live under geeksforgeeks/{easy,medium,hard}/{slug}/.
 *
 * Topic/tag distribution is deliberately NOT computed: neither source
 * reliably records topics per problem, and guessing from problem titles
 * would not be a real, verifiable statistic.
 */
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();

async function dirExists(p) {
  try {
    return (await fs.stat(p)).isDirectory();
  } catch {
    return false;
  }
}

async function listDirs(p) {
  if (!(await dirExists(p))) return [];
  const entries = await fs.readdir(p, { withFileTypes: true });
  return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function leetcodeStats() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  const problemDirs = entries
    .filter((e) => e.isDirectory() && /^\d{4}-/.test(e.name))
    .map((e) => e.name);

  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  for (const dir of problemDirs) {
    try {
      const readme = await fs.readFile(path.join(ROOT, dir, "README.md"), "utf8");
      const m = readme.match(/<h3>(Easy|Medium|Hard)<\/h3>/);
      if (m) byDifficulty[m[1]] += 1;
    } catch {
      // README not present yet (mid-sync) — skip, don't guess.
    }
  }
  return { total: problemDirs.length, byDifficulty };
}

async function gfgStats() {
  const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  for (const difficulty of ["easy", "medium", "hard"]) {
    const dirs = await listDirs(path.join(ROOT, "geeksforgeeks", difficulty));
    const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    byDifficulty[label] = dirs.length;
  }
  const total = Object.values(byDifficulty).reduce((a, b) => a + b, 0);
  return { total, byDifficulty };
}

async function main() {
  const lc = await leetcodeStats();
  const gfg = await gfgStats();

  const stats = {
    generatedAt: new Date().toISOString().slice(0, 10),
    totalProblems: lc.total + gfg.total,
    leetcode: lc.total,
    geeksforgeeks: gfg.total,
    easy: lc.byDifficulty.Easy + gfg.byDifficulty.Easy,
    medium: lc.byDifficulty.Medium + gfg.byDifficulty.Medium,
    hard: lc.byDifficulty.Hard + gfg.byDifficulty.Hard,
  };

  await fs.mkdir("stats", { recursive: true });
  await fs.writeFile("stats/stats.json", JSON.stringify(stats, null, 2) + "\n");

  const readme = await fs.readFile("README.md", "utf8");
  const block = [
    "<!-- STATS:START -->",
    "| Metric | Count |",
    "|---|---|",
    `| Total Problems | ${stats.totalProblems} |`,
    `| LeetCode | ${stats.leetcode} |`,
    `| GeeksforGeeks | ${stats.geeksforgeeks} |`,
    `| Easy | ${stats.easy} |`,
    `| Medium | ${stats.medium} |`,
    `| Hard | ${stats.hard} |`,
    "",
    `_Last updated ${stats.generatedAt}_`,
    "<!-- STATS:END -->",
  ].join("\n");

  const updated = readme.replace(
    /<!-- STATS:START -->[\s\S]*?<!-- STATS:END -->/,
    block
  );
  await fs.writeFile("README.md", updated);

  console.log("Stats:", stats);
}

main().catch((err) => {
  console.error("Stats generation failed:", err.message);
  process.exit(1);
});
