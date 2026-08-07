---
"saleor-dashboard": patch
---

You can now reload an installed extension from its manifest on the extension details page. The new Reload button (next to Deactivate and Delete) fetches the extension's manifest, shows a diff between the current state and the incoming manifest, and applies the changes (fields, permissions, extensions, webhooks) after confirmation — no uninstall/reinstall needed. Requires a Saleor version that supports the `appReloadManifest` mutation (3.24+).
