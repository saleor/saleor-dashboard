---
"saleor-dashboard": patch
---

The dashboard no longer breaks when its language setting is not recognised.

`LOCALE_CODE` values with surrounding whitespace, lower case letters or a dash (`"EN "`, `en`, `pt-BR`) used to resolve to no locale at all. Pages that format dates then crashed and the only workaround was to set the `locale` key in local storage by hand. The same happened when that key held a stale or unsupported value. Both are now normalised to a supported language and fall back to English, and a translation bundle that fails to load keeps the English messages instead of leaving the app half-initialised.
