# Puneeth Raj — DSA Solutions

This repository automatically archives my accepted solutions from LeetCode and GeeksforGeeks as I practice data structures and algorithms.

Every commit here corresponds to a real accepted submission — this is not a curated highlight reel and not generated filler. It's a natural side effect of actually solving problems.

## Stats

<!-- STATS:START -->
| Metric | Count |
|---|---|
| Total Problems | 0 |
| LeetCode | 0 |
| GeeksforGeeks | 0 |
| Easy | 0 |
| Medium | 0 |
| Hard | 0 |

_Last updated 2026-08-25_
<!-- STATS:END -->

Updated automatically by [`.github/workflows/update-stats.yml`](.github/workflows/update-stats.yml) whenever a solution is added or changed.

## Structure

**LeetCode** solutions are added by the [LeetHub](https://github.com/QasimWani/LeetHub) browser extension, which writes to the repository root using its own convention — one numbered folder per problem:

```text
0001-two-sum/
├── 0001-two-sum.py
└── README.md
```

**GeeksforGeeks** solutions are added by a small custom sync tool (this repo's `.github/` doesn't run it — it runs in the browser) and are organized by difficulty:

```text
geeksforgeeks/
└── medium/
    └── longest-subarray-with-sum-k/
        ├── solution.cpp
        └── README.md
```

Each solution keeps the language it was actually submitted in — nothing is translated or rewritten.

## Platforms & Languages

Languages vary by whatever I actually submitted in — see individual solution folders.

## How this stays automatic

1. Solve a problem, get **Accepted**.
2. LeetCode: [LeetHub](https://github.com/QasimWani/LeetHub) commits it automatically.
3. GeeksforGeeks: a small browser extension detects the result and, after a one-click confirmation, commits it.
4. Both create real commits with real solution content — no empty commits, no backdating, no fake activity.
