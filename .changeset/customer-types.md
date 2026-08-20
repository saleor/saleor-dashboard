---
"saleor-dashboard": patch
---

Customers can now be grouped into customer types, each with its own set of attributes.

Configuration has a new **Customers** section with **Customer types** and **Customer attributes**. A customer type defines the attributes its customers share, so details like tax ID, account manager, or contract tier live on the profile as proper fields instead of metadata or free-text notes. Types can be created, renamed, given a default, and have attributes assigned, reordered, or unassigned — the same way product and model types work.

On a customer profile you can pick the type, fill in its attributes, and jump to the type's settings from the attributes card. The type also appears as a badge in the profile header, linking to the customer list filtered to that type. The customer list gains a **Customer type** filter, and its filtering now uses the current `where` API.

The customer detail page has been reorganized around this: the header carries status, type, and member-since; the main column shows channel-scoped order KPIs, recent orders, and attributes; contact details, addresses, external reference, and gift cards sit in the sidebar. Recent orders rows are clickable across the full row.
