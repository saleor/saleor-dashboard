import ShippingMethod from "../apiRequests/ShippingMethod";
import Warehouse from "../apiRequests/Warehouse";
class ShippingUtils {
  shippingMethodId;
  shippingZoneId;
  warehouseId;

  createShipping(channelId, name, address, price) {
    const shippingMethod = new ShippingMethod();
    const warehouse = new Warehouse();
    return shippingMethod
      .createShippingZone(name, address.country)
      .then(shippingZoneResp => {
        this.shippingZoneId =
          shippingZoneResp.body.data.shippingZoneCreate.shippingZone.id;
        return warehouse
          .createWarehouse(name, this.shippingZoneId, address)
          .then(createWarehouseResp => {
            this.warehouseId =
              createWarehouseResp.body.data.createWarehouse.warehouse.id;
            return shippingMethod
              .createShippingRate(name, this.shippingZoneId)
              .then(rateResp => {
                this.shippingMethodId =
                  rateResp.body.data.shippingPriceCreate.shippingMethod.id;
                return shippingMethod.addChannelToShippingMethod(
                  this.shippingMethodId,
                  channelId,
                  price
                );
              });
          });
      });
  }

  getShippingMethodId() {
    return this.shippingMethodId;
  }

  getShippingZoneId() {
    return this.shippingZoneId;
  }

  getWarehouseId() {
    return this.warehouseId;
  }

  deleteShipping(startsWith) {
    const shippingMethod = new ShippingMethod();
    const warehouse = new Warehouse();
    shippingMethod.getShippingZones().then(resp => {
      if (resp.body.data.shippingZones) {
        const shippingZone = resp.body.data.shippingZones.edges;
        shippingZone.forEach(element => {
          if (element.node.name.includes(startsWith)) {
            shippingMethod.deleteShippingZone(element.node.id);
          }
        });
      }
    });
    warehouse.getWarehouses(100, startsWith).then(resp => {
      const warehouses = resp.body.data.warehouses.edges;
      warehouses.forEach(warehouseElement => {
        if (warehouseElement.node.name.includes(startsWith)) {
          warehouse.deleteWarehouse(warehouseElement.node.id);
        }
      });
    });
  }
}
export default ShippingUtils;
