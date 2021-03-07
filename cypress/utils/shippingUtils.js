import * as shippingMethodRequest from "../apiRequests/ShippingMethod";
import * as warehouseRequest from "../apiRequests/Warehouse";

let shippingMethod;
let shippingZone;
let warehouse;

export function createShipping({ channelId, name, address, price = 1 }) {
  return createShippingZone(name, address.country)
    .then(() => createWarehouse(name, shippingZone.id, address))
    .then(() => createShippingRate(name, shippingZone.id))
    .then(() =>
      shippingMethodRequest.addChannelToShippingMethod(
        shippingMethod.id,
        channelId,
        price
      )
    );
}

export function createShippingZone(name, country) {
  return shippingMethodRequest.createShippingZone(name, country).then(resp => {
    shippingZone = resp.body.data.shippingZoneCreate.shippingZone;
  });
}
export function createWarehouse(name, shippingZoneId, address) {
  return warehouseRequest
    .createWarehouse(name, shippingZoneId, address)
    .then(resp => {
      warehouse = resp.body.data.createWarehouse.warehouse;
    });
}
export function createShippingRate(name, shippingZoneId) {
  return shippingMethodRequest
    .createShippingRate(name, shippingZoneId)
    .then(
      resp =>
        (shippingMethod = resp.body.data.shippingPriceCreate.shippingMethod)
    );
}

export function getShippingMethod() {
  return shippingMethod;
}

export function getShippingZone() {
  return shippingZone;
}

export function getWarehouse() {
  return warehouse;
}

export function deleteShipping(startsWith) {
  cy.deleteProperElements(
    shippingMethodRequest.deleteShippingZone,
    shippingMethodRequest.getShippingZones,
    startsWith,
    "shippingZONE"
  );
  cy.deleteProperElements(
    warehouseRequest.deleteWarehouse,
    warehouseRequest.getWarehouses,
    startsWith,
    "Warehouse"
  );
}
