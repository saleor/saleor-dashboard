---
"saleor-dashboard": patch
---

Navigator (Ctrl/Cmd + K) is now announced correctly by screen readers.

The search field used the abstract `role="input"`, declared `aria-expanded` on a role that does not support it, and pointed `aria-activedescendant` at a hardcoded `/orders/` route with no `aria-controls` to make that reference resolvable. Results put `role="option"` on a child of the element that actually received `aria-selected`, and nothing in the popup was a `listbox`. Assistive technology therefore announced neither the field as a combobox, nor the popup as a list, nor which result was highlighted.

The field is now a `combobox` controlling a labelled `listbox`, `aria-expanded` follows the popup, and every result — action, setting, or resource row — is a single `option` node carrying its own id and `aria-selected`, so arrowing through the Navigator announces the highlighted item. The placeholder is translated too.
