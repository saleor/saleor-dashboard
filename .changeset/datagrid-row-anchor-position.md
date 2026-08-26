---
"saleor-dashboard": patch
---

Rows in list views (products, orders, customers, collections and the other datagrids) behave like real links again, so middle click and right click "Open link in new tab" work on them.

Each datagrid keeps a single anchor element that it moves over the cell under the cursor. Glide reports cell bounds in viewport coordinates, but the anchor added the page scroll offset to them and was positioned with `position: absolute` inside a `position: relative` wrapper. The anchor therefore landed away from the cell it pointed at — offset by the wrapper's own position on the page — so native link gestures hit the grid canvas instead of the link. Only Ctrl/Cmd + left click still opened a new tab, because that path dispatches a synthetic click on the anchor directly.

The anchor now uses `position: fixed` with the viewport bounds as reported, which puts it exactly over the hovered cell.

Because the anchor really does sit over the cell now, pointer events reach it instead of the grid, so it is shown only while it covers the cell under the cursor and hidden as soon as the pointer moves to the header, the row selection checkbox, a cell with its own action, or off the grid. Glide ignores mouse moves that land on an overlay, so an anchor left parked over a cell would swallow the pointer coming back to that cell and the row would lose its hover highlight.

Wheel events land on the anchor too. The previous workaround hid the anchor on wheel, which could not help: the browser has already latched the gesture onto the anchor's scroll chain, and React attaches `onWheel` as a passive listener, so the scroll could not be redirected. Wheel deltas are now forwarded to the grid's own scroller for the axes it can scroll, leaving the page to handle the rest, and the anchor is hidden until the next hover repositions it so it can never point at a row that has scrolled away.

Fixes #6345
