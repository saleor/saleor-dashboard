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

## Fulfillment

**Warehouse**:
A location that holds stock. Stock there can be sold only in channels the warehouse is assigned to.
_API name_: `Warehouse`. _Avoid_: treating "stock location" as a separate object.

**Stock**:
The quantity of one product variant in one warehouse. Edited on the product, not on the warehouse.
_API name_: `Stock`.

**Channel assignment**:
The link that makes a warehouse's stock available in a channel. It is written on the channel, because a warehouse has no channel field of its own.
_API name_: `Channel.warehouses`, `channelUpdate.addWarehouses`. _Avoid_: `Warehouse.channels`.

**Allocation strategy**:
How a channel chooses which of its warehouses fulfills an order. The warehouse order on the channel matters only when the strategy is prioritize sorting order.
_API name_: `allocationStrategy`.

**Pickup**:
Letting the customer collect an order at a warehouse. The warehouse address is what they see, and tax is calculated for that address.
_API name_: `clickAndCollectOption`. _Avoid_: "click and collect" in dashboard copy.

**Offer pickup**:
Whether customers can collect an order at this warehouse. The usual choice, used when pickup is turned on, is stock at this location, which saves the warehouse as public. Where the items come from is an advanced choice. Stock at any location, or pickup off, saves the warehouse as private. Stock still sells either way.
_API name_: `clickAndCollectOption`, `isPrivate`. _Avoid_: internal location, private stock, public stock, "stock won't be shown".

**Stock availability mode**:
Whether stock counts through the warehouse–channel link (direct, the default) or also requires a shipping zone that covers the destination country (legacy).
_API name_: `Shop.useLegacyShippingZoneStockAvailability`.

**Shipping zone**:
Countries and the delivery rates offered there. Linking a zone to a warehouse changes which stock counts only in legacy stock mode. Delivery rates never depend on that link.
_API name_: `ShippingZone`.
