import * as shippingMethodRequest from "../apiRequests/ShippingMethod";
import * as warehouseRequest from "../apiRequests/Warehouse";

export function createShipping({ channelId, name, address, price = 1 }) {
  let shippingMethod;
  let shippingZone;
  let warehouse;

  return createShippingZone(name, address.country)
    .then(shippingZoneResp => {
      shippingZone = shippingZoneResp;
      createWarehouse(name, shippingZone.id, address);
    })
    .then(warehouseResp => {
      warehouse = warehouseResp;
      createShippingRate(name, shippingZone.id);
    })
    .then(sippingMethodResp => {
      shippingMethod = sippingMethodResp;
      shippingMethodRequest.addChannelToShippingMethod(
        shippingMethod.id,
        channelId,
        price
      );
    })
    .then(() => ({ shippingMethod, shippingZone, warehouse }));
}

export function createShippingZone(name, country) {
  return shippingMethodRequest
    .createShippingZone(name, country)
    .its("body.data.shippingZoneCreate.shippingZone");
  // .then(resp => {
  //   shippingZone = resp.body.data.shippingZoneCreate.shippingZone;
  // });
}
export function createWarehouse(name, shippingZoneId, address) {
  return warehouseRequest
    .createWarehouse(name, shippingZoneId, address)
    .its("body.data.createWarehouse.warehouse");
  // .then(resp => {
  //   warehouse = resp.body.data.createWarehouse.warehouse;
  // });
}
export function createShippingRate(name, shippingZoneId) {
  return shippingMethodRequest
    .createShippingRate(name, shippingZoneId)
    .its("body.data.shippingPriceCreate.shippingMethod");
  // .then(
  //   resp =>
  //     (shippingMethod = resp.body.data.shippingPriceCreate.shippingMethod)
  // );
}

// export function getShippingMethod() {
//   return shippingMethod;
// }

// export function getShippingZone() {
//   return shippingZone;
// }

// export function getWarehouse() {
//   return warehouse;
// }

export function deleteShippingStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    shippingMethodRequest.deleteShippingZone,
    shippingMethodRequest.getShippingZones,
    startsWith,
    "shippingZONE"
  );
  cy.deleteElementsStartsWith(
    warehouseRequest.deleteWarehouse,
    warehouseRequest.getWarehouses,
    startsWith,
    "Warehouse"
  );
}
