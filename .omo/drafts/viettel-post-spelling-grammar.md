# Draft: viettel-post-spelling-grammar

## Intent
- **Intent**: CLEAR
- **Review required**: false
- **Slug**: viettel-post-spelling-grammar

## Request
Review and correct spelling and grammar in `_posts/2026-04-22-viettel-digital-talent-recap.md`.

## Exploration notes
Read the full post (161 lines). Found ~40 issues across categories:
- **Typos** (13): `tiem` → `time`, `runing` → `running`, `the the` → `the`, `ntext` → `next`, `laready` → `already`, `suspecious` → `suspicious`, `trainig` → `training`, `touse` → `to use`, `startegies` → `strategies`, `neligible` → `negligible`, `mintes` → `minutes`, `underpresenting` → `underrepresenting`, `judgers` → `judges` (×2), `SFt` → `SFT` (×2)
- **Grammar/usage** (~20): verb tense inconsistencies (`lied`→`lay`, `show`→`showed`, `sit`→`sat`), subject-verb agreement (`consume`→`consuming`, `eliminate`→`eliminating`), wrong prepositions (`resembled me with`→`reminded me of`), missing articles, pluralization (`millions`→`million`), sentence fragments

No semantic changes — corrections only.

## Evidence ledger
- File: `_posts/2026-04-22-viettel-digital-talent-recap.md` (161 lines)
- Build: `bundle exec jekyll build --future` passes currently

## Approach
Apply all fixes as a single surgical edit pass on the file, then verify build still passes. One commit.

## Must-NOT-Have
- No content restructuring
- No factual changes
- No stylistic rewrites beyond fixing broken grammar

## Approval gate

**Status**: awaiting-approval

**Brief**: I've read the entire post and catalogued ~40 spelling/grammar issues — typos, tense mismatches, missing articles, wrong prepositions, pluralization errors, and a few sentence fragments. One clean edit pass, one commit. Approve to write the plan.

**Next action**: On approval, write `.omo/plans/viettel-post-spelling-grammar.md` with full task breakdown, then ask the user to `/start-work`.
