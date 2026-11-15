---
"saleor-dashboard": patch
---

Metadata editors no longer throw away what you typed. When a save fails, your changes stay in the editor so you can try again; before, the editor went back to the saved values. When the metadata reloads while you're editing, for example because an app changed it, your changes stay as they are. Save stays disabled while a field shows an error, such as a duplicate key, instead of saving over the existing entry. While a save is running, the editor can't be closed and Save shows that it's busy; it closes as soon as the save is done. A row added and left without a key no longer counts as a change.
