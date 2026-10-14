# Native oxlint compiler-rule evaluation

The native rules are much faster, but oxlint 1.85.0 does not preserve the findings
of `eslint-plugin-react-hooks` 7.0.1. Keep the compiler checks in ESLint until the
warning differences are accepted or resolved. This evaluation does not change CI,
pre-commit, compiler configuration, or application behavior.

## Reproduce

Run `pnpm run evaluate:compiler-lint` from the workspace root on Node 24. An optional
output directory follows the command. The default is the gitignored
`.context/compiler-evaluation/` directory.

The command writes isolated native configuration, both raw diagnostic reports,
`files.json`, suppression probes, and `comparison.json`. It reads the active ESLint
compiler rules and oxlint ignores, asserts that both tools select the same files,
and runs without fixes. It excludes GraphQL and routine rules to measure compiler
linting separately. Errors abort the evaluation; warning differences are reported,
not treated as an adoption decision.

The comparison preserves duplicate warning instances and matches file, rule,
severity, line, and column. Messages differ between implementations and are not
compared. Oxlint locations use the first diagnostic label. Same-file/rule overlap
helps triage location changes but does not establish semantic equivalence.

## Results

Measured locally on 2026-10-14 against the source of PR #7016 (`a6d659674`):
4,752 identical selected files, zero errors. All findings are warnings.

| Rule                                   |  ESLint |  Native | Exact matches |
| -------------------------------------- | ------: | ------: | ------------: |
| purity                                 |       3 |       3 |             3 |
| refs                                   |     100 |     119 |            67 |
| set-state-in-render                    |       0 |       0 |             0 |
| set-state-in-effect                    |      58 |      85 |            56 |
| immutability                           |      17 |      19 |            16 |
| static-components                      |       4 |       5 |             4 |
| use-memo                               |      15 |      15 |            15 |
| void-use-memo                          |       0 |       0 |             0 |
| preserve-manual-memoization            |      58 |      16 |             0 |
| globals                                |       0 |       0 |             0 |
| error-boundaries                       |       0 |       0 |             0 |
| incompatible-library                   |       3 |       3 |             3 |
| unsupported-syntax                     |       0 |       0 |             0 |
| component-hook-factories (unsupported) |       0 |       — |             — |
| config (unsupported)                   |       0 |       — |             — |
| gating (unsupported)                   |       0 |       — |             — |
| **Total**                              | **258** | **265** |       **164** |

There are 94 ESLint-only and 101 native-only location instances. These numbers
include changed locations and must not be interpreted as counts of missed bugs.
Rules with no findings have no demonstrated repository parity.

Compiler-only ESLint took 38.5 seconds in the final run. Native oxlint
took 1.25 seconds including pnpm process startup. These are wall-clock
measurements on one machine, not CI measurements or total lint time. The GraphQL
processor and routine linting are outside these timings.

## Differences requiring review

- **Manual memoization:** only 11 warning instances overlap by file/rule, versus
  58 ESLint and 16 native instances. Native warnings can point at dependency
  arrays while ESLint points at callbacks. `CategoryProducts.tsx` illustrates the callback-versus-array location change.
  `useChannelReviewItems.tsx` has ESLint-only warnings about inferred
  `canScrollToSection`; `ModalProductFilterProvider.tsx` has a native-only warning.
  The mismatch is too large to call this equivalent coverage.
- **Refs:** all 100 ESLint instances overlap by file/rule, but only 67 match
  exactly. In `BulkPublishReviewStep.tsx`, both flag the render-time ref assignment
  at different columns. Native reports additional instances, including a ref
  assignment in `entity-refresh.ts`. Overlap does not prove every warning agrees.
- **Effects:** 56 instances match exactly. ESLint-only findings occur in
  `useVoucherSetupCardDisplayReady.ts` and `useExpandedOnboardingId.ts`; native
  has 29 unmatched instances. These need semantic review before replacement.
- **Immutability:** `RuleConditionName.tsx` is flagged by both, but ESLint points
  at the callback and native points at its mutation. Native additionally flags
  initialization in `useAuthProvider.ts` and closure mutation in
  `RichTextEditor.tsx`.
- **Static components:** the four existing instances match. Native adds the
  locally selected `Icon` in `CardMenu.tsx`.
- **Missing rules:** `config`, `gating`, and `component-hook-factories` have no
  native counterparts in the pinned version. Zero current findings does not
  justify silently deleting them.

The [Oxc compiler-support announcement](https://oxc.rs/blog/2026-08-18-react-compiler-support)
explains the native implementation and its compiler differences. Current upstream
documentation may describe versions newer than the pinned package; the installed
1.85.0 executable is the authority for this evaluation.

## Suppression probes

A small component calls a state setter inside an effect. Both tools warn without
a directive. Adding `eslint-disable-next-line react-hooks/exhaustive-deps` before
the dependency array suppresses compiler diagnostics in both. Changing the prefix
to `oxlint-disable-next-line` suppresses native diagnostics only; ESLint still
warns. Keep existing ESLint directives while any ESLint compiler rules remain.
The probe checks this one pattern, not every suppression form.

## Recommendation

Do not replace all compiler checks in this PR. Purity, use-memo, and
incompatible-library match their nonzero repository findings, but retaining other
compiler rules still incurs ESLint's shared compilation cost. A partial move has
little demonstrated runtime benefit.

Before adoption, review the unmatched manual-memoization and effect findings,
reduce representative differences to fixtures, decide which behavior is wanted,
and account for the three unsupported rules. Preserve suppression behavior and
rerun the comparison against the exact version selected for adoption.
