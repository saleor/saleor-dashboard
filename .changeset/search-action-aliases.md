---
"saleor-dashboard": patch
---

`SEARCH_ACTION` extensions can now declare `options.aliases` — extra terms the command palette (Cmd+K) matches against, on top of the extension label and the owning app's name.

Use it when the words a user types are not the words in your label. An action labelled "Configure Avalara" can be found by typing "taxes", "legal" or "avatax":

```json
{
  "label": "Configure Avalara",
  "mount": "SEARCH_ACTION",
  "target": "POPUP",
  "url": "https://example.com/action",
  "options": {
    "aliases": ["taxes", "legal", "avatax"]
  }
}
```

Aliases are matched, never displayed, and matching is case-insensitive and typo-tolerant like the rest of the palette. The option is valid only on the `SEARCH_ACTION` mount; setting it elsewhere fails manifest validation.
