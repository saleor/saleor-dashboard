import ShippingMethod from "../apiRequests/ShippingMethod";
import Warehouse from "../apiRequests/Warehouse";
import Promises from "../support/promises/promises.js";
class ShippingUtils {
  promises = new Promises();
  shippingMethodRequest = new ShippingMethod();
  warehouseRequest = new Warehouse();

  shippingMethod;
  shippingZone;
  warehouse;

  async createShipping(channelId, name, address, price) {
    await this.createShippingZone(name, address.country);
    await this.createWarehouse(name, this.shippingZone.id, address);
    await this.createShippingRate(name, this.shippingZone.id);
    this.addChannelToShippingMethod(this.shippingMethod.id, channelId, price);
  }

  async createShippingZone(name, country) {
    const respProm = await this.promises.createPromise(
      this.shippingMethodRequest.createShippingZone(name, country)
    );
    this.shippingZone = respProm.shippingZoneCreate.shippingZone;
  }
  async createWarehouse(name, shippingZoneId, address) {
    const respProm = await this.promises.createPromise(
      this.warehouseRequest.createWarehouse(name, shippingZoneId, address)
    );
    this.warehouse = respProm.createWarehouse.warehouse;
  }
  async createShippingRate(name, shippingZoneId) {
    const respProm = await this.promises.createPromise(
      this.shippingMethodRequest.createShippingRate(name, shippingZoneId)
    );
    this.shippingMethod = respProm.shippingPriceCreate.shippingMethod;
  }
  async addChannelToShippingMethod(shippingMethodId, channelId, price) {
    await this.promises.createPromise(
      this.shippingMethodRequest.addChannelToShippingMethod(
        shippingMethodId,
        channelId,
        price
      )
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
