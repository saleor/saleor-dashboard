---
"saleor-dashboard": patch
---

Update dependencies to address known security advisories. The dependency bump removes 12 CVEs that were reported by `pnpm audit` on latest `main` branch:

- `lodash` — Code Injection via `_.template` ([GHSA-r5fr-rjxr-66jc](https://github.com/advisories/GHSA-r5fr-rjxr-66jc))
- `lodash` — Prototype Pollution via array ([GHSA-f23m-r3pf-42rh](https://github.com/advisories/GHSA-f23m-r3pf-42rh))
- `vite` — `server.fs.deny` bypassed with queries ([GHSA-v2wj-q39q-566r](https://github.com/advisories/GHSA-v2wj-q39q-566r))
- `vite` — Arbitrary File Read via Vite Dev Server ([GHSA-p9ff-h696-f583](https://github.com/advisories/GHSA-p9ff-h696-f583))
- `vite` — Path Traversal in Optimized Deps ([GHSA-4w7w-66w2-5vf9](https://github.com/advisories/GHSA-4w7w-66w2-5vf9))
- `protobufjs` — Code injection through bytes field ([GHSA-66ff-xgx4-vchm](https://github.com/advisories/GHSA-66ff-xgx4-vchm))
- `protobufjs` — Code generation gadget after prototype ([GHSA-75px-5xx7-5xc7](https://github.com/advisories/GHSA-75px-5xx7-5xc7))
- `protobufjs` — Process-wide denial of service ([GHSA-jvwf-75h9-cwgg](https://github.com/advisories/GHSA-jvwf-75h9-cwgg))
- `protobufjs` — Denial of service through unbounded input ([GHSA-685m-2w69-288q](https://github.com/advisories/GHSA-685m-2w69-288q))
- `protobufjs` — Denial of service from crafted field ([GHSA-2pr8-phx7-x9h3](https://github.com/advisories/GHSA-2pr8-phx7-x9h3))
- `protobufjs` — Prototype injection in generated message ([GHSA-fx83-v9x8-x52w](https://github.com/advisories/GHSA-fx83-v9x8-x52w))
- `@protobufjs/utf8` / `protobufjs` — Overlong UTF-8 decoding ([GHSA-q6x5-8v7m-xcrf](https://github.com/advisories/GHSA-q6x5-8v7m-xcrf))
