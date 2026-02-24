---
"saleor-dashboard": patch
---

Fix pnpm audit security vulnerabilities by adding dependency overrides for ajv, and bumping qs to a patched version. Suppress minimatch CVE-2026-26996 (ReDoS) via auditConfig since upgrading to minimatch 10.x breaks Jest coverage instrumentation.
