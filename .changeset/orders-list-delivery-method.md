---
"saleor-dashboard": patch
---

Add a "Delivery" column to the orders list. Each order now shows a tag indicating how it is delivered: "Shipping" for a shipping method and "Pickup" for collection at a warehouse (click & collect). Orders without a delivery method, such as draft or digital orders, show a dash. On the order page, a pickup order shows Pickup with the collection point name in the summary, and the customer card shows a "Pickup location" section with the location name, whether stock can come from other warehouses, and its address, instead of "Shipping address". The warehouses list shows a Pickup label on locations customers can collect from.
