---
"saleor-dashboard": patch
---

The vendored `@saleor/sdk` copy that lived in `src/legacy-sdk` has been merged into the Dashboard
itself. Authentication now runs on the Dashboard's own Apollo client, GraphQL documents and
generated types instead of a second, separately generated copy of the schema.

This is an internal refactor with no change to how you log in, but two bugs went away with it:
a token refresh triggered while another refresh was already in flight could refresh itself in a
loop, and logging out refetched every open query against the token that had just been cleared,
producing a burst of authorization errors on the way to the login screen.
