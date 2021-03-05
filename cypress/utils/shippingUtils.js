import ShippingMethod from "../apiRequests/ShippingMethod";
import Warehouse from "../apiRequests/Warehouse";

const shippingMethodRequest = new ShippingMethod();
const warehouseRequest = new Warehouse();

// shippingMethod;
// shippingZone;
// warehouse;

export function createShipping({ channelId, name, address, price = 1 }) {
  return createShippingZone(name, address.country)
    .then(() => createWarehouse(name, this.shippingZone.id, address))
    .then(() => createShippingRate(name, this.shippingZone.id))
    .then(() =>
      shippingMethodRequest.addChannelToShippingMethod(
        this.shippingMethod.id,
        channelId,
        price
      )
    );
}

export function createShippingZone(name, country) {
  return shippingMethodRequest.createShippingZone(name, country).then(resp => {
    this.shippingZone = resp.body.data.shippingZoneCreate.shippingZone;
  });
}
export function createWarehouse(name, shippingZoneId, address) {
  return warehouseRequest
    .createWarehouse(name, shippingZoneId, address)
    .then(resp => {
      this.warehouse = resp.body.data.createWarehouse.warehouse;
    });
}
export function createShippingRate(name, shippingZoneId) {
  return shippingMethodRequest
    .createShippingRate(name, shippingZoneId)
    .then(
      resp =>
        (this.shippingMethod =
          resp.body.data.shippingPriceCreate.shippingMethod)
    );
}

export function getShippingMethod() {
  return this.shippingMethod;
}

export function getShippingZone() {
  return this.shippingZone;
}

export function getWarehouse() {
  return this.warehouse;
}

export function deleteShipping(startsWith) {
  const shippingMethod = new ShippingMethod();
  const warehouse = new Warehouse();
  cy.deleteProperElements(
    shippingMethod.deleteShippingZone,
    shippingMethod.getShippingZones,
    startsWith,
    "shippingZONE"
  );
  cy.deleteProperElements(
    warehouse.deleteWarehouse,
    warehouse.getWarehouses,
    startsWith,
    "Warehouse"
  );
}
