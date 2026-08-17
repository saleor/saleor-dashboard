# Saleor Dashboard

The admin interface for a Saleor store. This glossary records the terms whose dashboard-facing
name differs from the API name, and the concepts the dashboard invents on top of the API.

## Modeling

**Model**:
A single piece of structured content authored in the dashboard.
_API name_: `Page`. _Avoid_: page, document, entry.

**Model type**:
The schema a model conforms to — its name plus its assigned attributes.
_API name_: `PageType`. _Avoid_: page type, content type, template.

**Model type group**:
A set of model types displayed together because their names share a prefix. Derived from the
names themselves, not stored — renaming a model type can move it between groups or dissolve
the group entirely.
_Avoid_: category, folder, collection.

## Navigation pins

**Navigation pin**:
A shortcut in the sidebar that opens the model list filtered to one model type. The pinned
thing is always a single model type; a group cannot be pinned.
_Avoid_: favourite, bookmark, shortcut. Note this is unrelated to the _pinned tab_ on the model
list, which only reorders that page's tab strip.

**User pin**:
A navigation pin that one staff member created for themselves, visible only to them, and
removable only by them.
_Avoid_: personal pin, private pin, my pin.

**Organization pin**:
A navigation pin that applies to every staff member in the store. Created and removed centrally;
an individual staff member cannot remove one.
_Avoid_: org pin, global pin, shared pin, team pin.

**Pin target**:
The sidebar section a navigation pin appears under. Either Favorites or one of the existing
sections (Catalog, Fulfillment, and so on). A pin is invisible to any staff member who cannot
see its target section.
_Avoid_: pin location, pin destination, pin group.

**Favorites**:
A sidebar section that exists only when it holds at least one navigation pin, and only ever
holds user pins. Organization pins cannot target it.
_Avoid_: favourites, my pins, quick links.
