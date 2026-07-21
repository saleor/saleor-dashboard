# Settings catalog

When adding or renaming a setting on a Settings hub (Orders, Store, Refunds, …):

1. Add or update an entry in `src/configuration/settingsCatalog/` (per-hub module).
2. Reuse existing `MessageDescriptor`s for the title when possible; add keyword aliases for common search phrases.
3. Add a stable hash to `hashes.ts` and set the same `id` on the UI control (`SettingsSection`, `SettingsToggleRow`, matrix header, or `SettingsLinkCard`).
4. Point `href` at `settingsHref(path, hash)`.
5. Set `permissions` / `ownership` to match who can open the destination.
6. Run `pnpm run test:quiet src/configuration/settingsCatalog/settingsCatalog.test.ts`.

## Channel-only concepts

Dual-edited order policies (auto-confirm, gift cards, unpaid, delete expired) stay in `orders.ts` → Orders hub.

Channel-only concepts live in `channels.ts` (`MANAGE_CHANNELS`, `ownership: "channel"`). Until the channel config view has stable anchors, `href` may be the channels list **without** a hash — keep entry `id`s stable and retarget `href`/`hash` after the redesign. Do not index per-channel entity rows.
