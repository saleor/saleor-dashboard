# Saleor Dashboard — Orders Page Performance Report

**URL:** `https://lukasz-322.staging.saleor.cloud/dashboard/orders?asc=false&sort=number`
**Date:** 2026-04-01
**Environment:** Production build (staging), Chrome 146, macOS, no CPU/network throttling

---

## Core Web Vitals Summary

| Metric   | With Cache (warm) | Without Cache (reload) | Rating                      |
| -------- | ----------------- | ---------------------- | --------------------------- |
| **LCP**  | 3,039 ms          | 2,796 ms               | Needs improvement (>2500ms) |
| **CLS**  | 0.04              | 0.04                   | Good (<0.1)                 |
| **TTFB** | 3 ms              | 1 ms                   | Good                        |
| **FCP**  | ~400 ms           | ~280 ms                | Good                        |

**Key takeaway:** LCP is the main problem. 99.9% of LCP time is **render delay** — the browser has all resources but the app takes ~3s to paint the LCP element (the order list text). TTFB and network are fast; the bottleneck is JavaScript execution and the GraphQL waterfall.

---

## Bottleneck #1: GraphQL Request Waterfall (biggest impact)

**11 GraphQL requests** fire on page load, in a sequential waterfall pattern:

| #   | Operation                  | Purpose                       | Blocking?                   | Notes                                        |
| --- | -------------------------- | ----------------------------- | --------------------------- | -------------------------------------------- |
| 1   | `refreshTokenWithUser`     | Auth token refresh            | **Yes — blocks everything** | Must complete before any authenticated query |
| 2   | `UserDetails`              | Current user info             | Yes — blocks routing        | Waits for token                              |
| 3   | `ShopInfo`                 | Shop metadata + all countries | Yes — blocks app shell      | **Returns ~250 countries (huge payload)**    |
| 4   | `BaseChannels`             | Channel list                  | Yes — blocks app shell      | Waits for token                              |
| 5   | `ExtensionList` (nav)      | Sidebar extensions            | No                          | Could be deferred                            |
| 6   | `AppFailedPendingWebhooks` | Webhook health                | No                          | **Cost: 100, not needed for orders**         |
| 7   | `AppHasProblems`           | App health check              | No                          | **Cost: 200, not needed for orders**         |
| 8   | `SaveOnBoardingState`      | **MUTATION on every load**    | No                          | **Unnecessary write on read path**           |
| 9   | `ExtensionList` (orders)   | Order page extensions         | No                          | Duplicate query shape with #5                |
| 10  | `RefreshLimits`            | Usage limits                  | No                          | Could be lazy                                |
| 11  | `OrderList`                | **The actual data**           | Yes                         | The only query the user cares about          |

**The critical issue:** The `OrderList` query (the only one the user needs) can't fire until after auth completes (~1-1.5s). Then it takes another ~1-1.5s for the GraphQL response + React rendering.

### Recommendations

1. **Parallelize auth-dependent queries**: Once the token is available, fire `OrderList`, `UserDetails`, `ShopInfo`, and `BaseChannels` simultaneously — not sequentially. Currently they appear to fire in a cascade. Apollo Client `useQuery` hooks should naturally parallelize, but something in the component tree is likely serializing them (conditional rendering on auth state, nested providers, etc.).

2. **Remove `SaveOnBoardingState` mutation from page load**: This is a write operation firing on every navigation. Move it to only fire when onboarding state actually changes.

3. **Defer non-critical queries**: `AppFailedPendingWebhooks` (cost: 100), `AppHasProblems` (cost: 200), `ExtensionList`, and `RefreshLimits` are not needed for initial paint. Load them after LCP with `useEffect` or React's `startTransition`.

4. **Consolidate `ExtensionList` queries**: Two separate `ExtensionList` calls with different mount filters. Consider merging into one query or caching the first result.

5. **Trim `ShopInfo` response**: The full countries list (~250 entries) is fetched on every page load. Consider:
   - Lazy-loading countries only when needed (e.g., in address forms)
   - Caching countries in localStorage/IndexedDB
   - Using a separate, cacheable query for countries

---

## Bottleneck #2: JavaScript Bundle Size & Chunk Count

**84 JS chunks** loaded for the orders page. While code-splitting is good, this many chunks means:

- Many parallel HTTP/2 requests competing for bandwidth
- Each chunk requires evaluation time on the main thread
- The critical path includes: `index.js` → `vendor.js` → then ~80 lazily loaded chunks

### Key chunks for orders page:

- `Datagrid-C6j0ZLHq.js` — the data grid component
- `ListFilters-Q0YzU4BY.js` — filter UI
- `ColumnPicker-CSMHWvYQ.js` — column management
- `TablePagination*.js` — pagination
- Many small utility chunks (`sort.js`, `utils.js`, `url-utils.js`, etc.)

### Recommendations

6. **Consolidate small utility chunks**: Many chunks are tiny utility modules (`sort.js`, `url-utils.js`, `useCurrentDate.js`, `useClipboard.js`). Vite's `manualChunks` config could group these into fewer chunks to reduce HTTP request overhead.

7. **Preload critical chunks**: Add `<link rel="modulepreload">` for the known chunks needed by the orders route. Currently the browser discovers them only after parsing the parent chunk.

---

## Bottleneck #3: Cache Headers

Two static assets have **TTL: 0** (no browser caching):

| Asset                            | Issue                                            |
| -------------------------------- | ------------------------------------------------ |
| `vendor-D766P-4w.js`             | **0s cache TTL** — this is the largest JS bundle |
| `Inter-roman.var-C-r5W2Hj.woff2` | **0s cache TTL** — the main font                 |

Both are content-hashed (fingerprinted filenames), so they're safe for long-term caching.

### Recommendations

8. **Set `Cache-Control: public, max-age=31536000, immutable`** for all content-hashed static assets (`/static/*`). This is a CloudFront/S3 configuration change. Currently the CDN returns `304` responses, which still require a round-trip.

---

## Bottleneck #4: Render-Blocking CSS

Two CSS files are render-blocking:

- `vendor-ZWCD_XAe.css` (356ms)
- `index-CBUTLMmQ.css` (352ms)

Both return `304` (cached but validated), taking ~350ms each due to the round-trip.

### Recommendations

9. **With proper cache headers (Bottleneck #3)**, these would load from disk cache instantly (0ms) instead of requiring a validation round-trip.

---

## Bottleneck #5: No Resource Hints

No `<link rel="preconnect">` tags are configured. While the dashboard uses same-origin for GraphQL, the CDN connection could benefit from preconnection.

### Recommendations

10. **Add preconnect for the GraphQL endpoint** if it's on a different origin from the HTML. In this case both are same-origin, so this is low priority.

---

## Bottleneck #6: CLS from Animation

CLS score is 0.04 (good), caused by a `beamMove` animation using `stroke-dashoffset` — a non-composited CSS property. This forces layout recalculations.

### Recommendations

11. **Replace `stroke-dashoffset` animation** with a composited alternative (e.g., using `transform` or `opacity`). This would eliminate the ~50 micro layout shifts during the loading animation.

---

## Priority-Ranked Action Items

| Priority | Action                                                                                              | Expected LCP Impact                         | Effort      |
| -------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------- |
| **P0**   | Parallelize GraphQL queries after auth (don't serialize them)                                       | -500-1000ms                                 | Medium      |
| **P0**   | Set immutable cache headers on hashed static assets                                                 | -300-700ms on repeat visits                 | Low (infra) |
| **P1**   | Defer non-critical queries (AppFailedPendingWebhooks, AppHasProblems, ExtensionList, RefreshLimits) | -200-400ms                                  | Low         |
| **P1**   | Remove `SaveOnBoardingState` mutation from page load                                                | -100-200ms (removes a write from read path) | Low         |
| **P1**   | Preload critical route chunks with `modulepreload`                                                  | -100-200ms                                  | Low         |
| **P2**   | Trim ShopInfo (lazy-load countries list)                                                            | -50-100ms (smaller payload)                 | Medium      |
| **P2**   | Consolidate small JS chunks into fewer bundles                                                      | -50-100ms                                   | Low         |
| **P2**   | Fix beamMove animation to use composited properties                                                 | Improves CLS                                | Low         |
| **P3**   | Consolidate duplicate ExtensionList queries                                                         | Reduces server load                         | Low         |
