---
name: saleor-dashboard-security-audit
description: Triage OSV and `pnpm audit` security findings and propose batched, accept-first dependency fixes. Use when asked to run a security audit, fix security vulnerabilities, update vulnerable packages, or analyze dependency audit output.
---

# Dependency Security Audit & Fix Triage

Goal: turn dependency audit findings into a small set of **accept-first** batches the user can approve and merge independently. Do NOT apply fixes until the user accepts the proposal. NEVER fix everything in one commit.

## Always install through Socket Firewall (sfw)

When applying fixes you install dependencies — the exact moment a malicious or
compromised package would land on the machine. **Never run a bare `pnpm install`
in this workflow.** Wrap every install with [Socket Firewall Free](https://github.com/SocketDev/sfw-free),
which scans dependencies in real time and blocks known-malicious ones before
they reach disk:

```bash
sfw pnpm install                 # instead of `pnpm install`
sfw pnpm install --frozen-lockfile
```

If `sfw` is missing, install it first with `npm i -g sfw` (binaries for
macOS/Linux/Windows are on the releases page). Same pattern for any other
manager: `sfw <package-manager> <command>`.

## How this repo fixes vulnerabilities

Most findings are **transitive** (deep in the dep tree). This repo does NOT bump those individually — it pins them via **`pnpm-workspace.yaml` → `overrides:`** (the single source of truth; never use `package.json` → `pnpm.overrides`). Direct deps are bumped in `package.json`.

Key config already in `pnpm-workspace.yaml`:

- `overrides:` — pin a transitive (or direct-via-resolution) package to a patched range, e.g. `"ws@>=8.0.0 <8.21.0": ">=8.21.0"`. To fix an existing-but-outdated override, widen its range — don't add a duplicate key.
- `minimumReleaseAge: 30240` (= **21 days**). New installs must be ≥21 days old. A patched version released < 21 days ago will be **rejected** unless added to `minimumReleaseAgeExclude`.
- `minimumReleaseAgeExclude:` — per-package bypass of the age gate (used sparingly, with a comment explaining why).
- `auditConfig.ignoreCves:` — CVEs intentionally accepted (e.g. minimatch ReDoS variants that only affect dev/build tools and whose fix breaks CJS consumers). Check this before proposing a fix — it may already be a deliberate accept.
- `trustPolicy: no-downgrade` + `trustPolicyExclude:` — provenance/signing gate.

## Procedure

### 1. Collect & parse

Run both scanners. OSV is the advisory inventory because it checks every
package/version in `pnpm-lock.yaml` against the databases aggregated by OSV.
`pnpm audit` supplements it with pnpm dependency paths and npm-specific
remediation data; do not treat it as the complete advisory source.
OSV-Scanner is required; if it is missing, install the official binary (on
macOS with Homebrew: `brew install osv-scanner`) rather than skipping this scan.

```bash
osv_status=0
osv-scanner scan source -L pnpm-lock.yaml --format json > /tmp/osv-audit.json || osv_status=$?
if [ "$osv_status" -gt 1 ]; then exit "$osv_status"; fi

pnpm audit --json > /tmp/pnpm-audit.json
```

OSV-Scanner exits with status 1 when it finds vulnerabilities, so only statuses
greater than 1 are scanner errors. Parse `/tmp/osv-audit.json` first, merging
records by `id` and `aliases`, then join the pnpm findings by package and
installed version.

In the pnpm JSON, `actions` only suggests partial fixes. Each advisory carries:
`module_name`, `severity`, `patched_versions`, `vulnerable_versions`, `title`,
`github_advisory_id`, `url`, `cwe`, and `findings[].version` /
`findings[].paths`. The dependency path (top-level dep = 2nd path segment;
`path.split(">").length === 2` means it's a **direct** dep) tells you
direct-vs-transitive. Useful one-liner:

```js
node -e '
const a=Object.values(JSON.parse(require("fs").readFileSync("/tmp/pnpm-audit.json","utf8")).advisories);
const o={critical:0,high:1,moderate:2,low:3};
a.sort((x,y)=>(o[x.severity]-o[y.severity])||x.module_name.localeCompare(y.module_name));
for(const v of a){const p=v.findings.flatMap(f=>f.paths);
const tops=[...new Set(p.map(s=>s.split(">")[1]||s))];const direct=p.some(s=>s.split(">").length===2);
console.log(`[${v.severity}] ${v.module_name} ${v.findings.map(f=>f.version)} -> ${v.patched_versions} ${v.github_advisory_id} ${direct?"DIRECT":""}\n   ${v.title}\n   via: ${tops.join(" | ")}`);}'
```

> **Note — no CVSS in `pnpm audit` output.** pnpm's audit JSON does **not**
> include a `cvss` field (only `severity`). For full details on a record found
> by OSV-Scanner, use the [OSV API](https://osv.dev/). It accepts either the
> OSV/GHSA ID or its CVE alias:
>
> ```bash
> curl -fsSL "https://api.osv.dev/v1/vulns/GHSA-479c-33wc-g2pg"
> curl -fsSL "https://api.osv.dev/v1/vulns/CVE-2026-23869"
> ```
>
> Check `aliases` for the corresponding CVE/GHSA IDs and `severity` for CVSS
> vectors. When OSV has no quantitative score, use the source database's
> severity; use `pnpm audit`'s severity only for pnpm-only metadata.

### 2. Check the age gate for every proposed target

For each patched version you intend to pin, confirm it's ≥21 days old (released before today − 21d):

```bash
npm view <pkg> time --json   # find the patched version's publish date
```

- **Age OK** → safe to pin/bump normally.
- **Too new** → prefer the oldest age-OK version that still satisfies `patched_versions` (a partial fix that clears most advisories is fine — note what's left). Only bypass via `minimumReleaseAgeExclude` if severity **requires** it (critical, or production-path high with no age-OK fix), and only after asking for authorization. Document the bypass with a comment + advisory link.

### 3. Prioritize (in order)

1. **Severity first** — criticals (RCE, injection) before highs before moderate/low. `pnpm audit` no longer emits CVSS, so sort by `severity`; if you need a quantitative tiebreak, look up the advisory by GHSA/CVE ID in OSV and use its CVSS vector.
2. **Patch over major** — a major bump (e.g. `uuid` 9→11) is a breaking change; split it out as its own effort needing code review, never bundle it into a routine audit batch.
3. **Group related packages** — one override often clears many advisories (e.g. a single `dompurify` bump cleared ~9 findings; one `picomatch`/`ws`/`brace-expansion` bump covers all paths). Bump tool families together (eslint + plugins, all `@graphql-codegen/*`, etc.).
4. **Prefer the older age-OK fix** over bypassing the age gate (see step 2).

### 4. Propose batches (do NOT apply yet)

Split into small, independently-mergeable batches. A good default split:

- **Batch A — Criticals** (RCE/injection). Smallest, highest urgency, merge first.
- **Batch B — Direct-dep bumps** (e.g. `vite`, `qs`) — isolated `package.json` changes that touch build/runtime.
- **Batch C — High transitive overrides** (grouped: picomatch, ws, brace-expansion…).
- **Batch D — A large single-package cluster** if one bump clears many findings (e.g. dompurify).
- **Batch E — Moderate/low transitive overrides.**
- **Batch F — Deferred / needs-decision**: fixes whose only patch is too-new (bypass-or-wait), major breaking bumps, and CVEs already in `auditConfig.ignoreCves`. Present these as explicit choices, don't silently skip them.

Present a report: per batch list package, current→target, severity (+ GHSA id / CVE), dep path, age status, and the exact `pnpm-workspace.yaml` / `package.json` edit. Ask the user which batches to apply.

### 5. After acceptance (per batch)

1. Edit `pnpm-workspace.yaml` overrides (or `package.json` for direct deps).
2. `sfw pnpm install` to update `pnpm-lock.yaml` (always through Socket Firewall — see above).
3. Re-run both OSV-Scanner and `pnpm audit` to confirm the targeted findings are
   gone and nothing regressed.
4. For build/runtime-affecting deps (`vite`, etc.), run `pnpm run build` / relevant tests.
5. One commit per batch. Skip changesets — dependency security bumps are internal (see `saleor-dashboard-changesets`).
