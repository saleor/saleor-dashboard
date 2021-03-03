import ShippingMethod from "../apiRequests/ShippingMethod";
import Warehouse from "../apiRequests/Warehouse";
class ShippingUtils {
  shippingMethodRequest = new ShippingMethod();
  warehouseRequest = new Warehouse();

  shippingMethod;
  shippingZone;
  warehouse;

  createShipping({ channelId, name, address, price = 1 }) {
    return this.createShippingZone(name, address.country)
      .then(() => this.createWarehouse(name, this.shippingZone.id, address))
      .then(() => this.createShippingRate(name, this.shippingZone.id))
      .then(() =>
        this.shippingMethodRequest.addChannelToShippingMethod(
          this.shippingMethod.id,
          channelId,
          price
        )
      );
  }

  createShippingZone(name, country) {
    return this.shippingMethodRequest
      .createShippingZone(name, country)
      .then(resp => {
        this.shippingZone = resp.body.data.shippingZoneCreate.shippingZone;
      });
  }
  createWarehouse(name, shippingZoneId, address) {
    return this.warehouseRequest
      .createWarehouse(name, shippingZoneId, address)
      .then(resp => {
        this.warehouse = resp.body.data.createWarehouse.warehouse;
      });
  }
  createShippingRate(name, shippingZoneId) {
    return this.shippingMethodRequest
      .createShippingRate(name, shippingZoneId)
      .then(
        resp =>
          (this.shippingMethod =
            resp.body.data.shippingPriceCreate.shippingMethod)
      );
  }

  getShippingMethod() {
    return this.shippingMethod;
  }

  getShippingZone() {
    return this.shippingZone;
  }

  getWarehouse() {
    return this.warehouse;
  }

  deleteShipping(startsWith) {
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
}
export default ShippingUtils;
