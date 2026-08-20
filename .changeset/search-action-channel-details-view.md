---
"saleor-dashboard": patch
---

`SEARCH_ACTION` extensions can now be scoped to the channel details view with `options.views: ["CHANNEL_DETAILS"]`.

Use it for actions that only make sense while looking at one channel — a payment app's per-channel configuration, for example. The action appears in the command palette (Cmd+K) only on `/channels/<id>`, and receives that channel's id:

```json
{
  "label": "Channel payment settings",
  "mount": "SEARCH_ACTION",
  "target": "POPUP",
  "url": "https://example.com/channel-config",
  "options": {
    "views": ["CHANNEL_DETAILS"]
  }
}
```

The extension is opened with `channelId` as a query param, holding the channel's global id (e.g. `Q2hhbm5lbDox`). Resolve the slug from it if you need one. As with every other view, omitting `options.views` still means the action shows everywhere.
