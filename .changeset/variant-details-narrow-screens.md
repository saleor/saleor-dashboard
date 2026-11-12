---
"saleor-dashboard": patch
---

The variant details and variant create pages now work on narrow screens. Previously, below 1280px the variant list was stacked above the form at full screen height, so the form started a screen further down, and between 1025px and 1279px the list stayed pinned and covered the form while it scrolled. Now the list folds into a switcher above the form: it shows the open variant and its place among the product's variants, has previous and next buttons, and opens the full list with search and "Add variant" on demand. On wide screens the list stays beside the form.

The variant list also behaves better while it loads and when it is searched: the "Not visible in the list" row no longer flashes above the list while the page loads, a search with no results says so and offers to clear it, and variants can be reordered by touch and with the keyboard.

Dragging a variant to a new place in the list now keeps it there. Previously the variant jumped back to where it came from and moved again once the change was saved, and the form next to the list was locked meanwhile. Several variants can be moved one after another without waiting, and a move that can't be saved puts the variant back. Pages of variants loaded further down the list now stay loaded after a reorder and after a search is cleared.
