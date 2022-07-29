import { updateChannelWarehouses } from "../requests/Channels";
import * as shippingMethodRequest from "../requests/ShippingMethod";
import * as warehouseRequest from "../requests/Warehouse";
import { getDefaultChannel } from "./channelsUtils";

export function createShipping({
  channelId,
  name,
  address,
  price = 1,
  minProductPrice = 0,
}) {
  let shippingMethod;
  let shippingZone;
  let warehouse;

  return warehouseRequest
    .createWarehouse({
      name,
      address,
    })
    .then(warehouseResp => {
      warehouse = warehouseResp;

      updateChannelWarehouses(channelId, warehouse.id);
      shippingMethodRequest
        .createShippingZone(name, address.country, channelId, warehouse.id)
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;

          shippingMethodRequest.createShippingRate({
            name,
            shippingZone: shippingZone.id,
          });
        });
    })
    .then(({ shippingMethod: sippingMethodResp }) => {
      shippingMethod = sippingMethodResp;
      shippingMethodRequest.addChannelToShippingMethod(
        shippingMethod.id,
        channelId,
        price,
        minProductPrice,
      );
    })
    .then(() => ({ shippingMethod, shippingZone, warehouse }));
}

export function createShippingWithDefaultChannelAndAddress(name) {
  let defaultChannel;

  return getDefaultChannel()
    .then(channel => {
      defaultChannel = channel;
      cy.fixture("addresses");
    })
    .then(fixtureAddresses =>
      createShipping({
        channelId: defaultChannel.id,
        name,
        address: fixtureAddresses.plAddress,
      }),
    )
    .then(({ shippingMethod, shippingZone, warehouse }) => ({
      shippingMethod,
      shippingZone,
      warehouse,
      defaultChannel,
    }));
}

export function createShippingRate({ name, shippingZoneId }) {
  return shippingMethodRequest
    .createShippingRate({ name, shippingZone: shippingZoneId })
    .its("body.data.shippingPriceCreate.shippingMethod");
}

export function deleteShippingStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    shippingMethodRequest.deleteShippingZone,
    shippingMethodRequest.getShippingZones,
    startsWith,
  ).deleteElementsStartsWith(
    warehouseRequest.deleteWarehouse,
    warehouseRequest.getWarehouses,
    startsWith,
  );
}

export function createShippingWithDefaultChannel(name, price) {
  let defaultChannel;

  return getDefaultChannel()
    .then(channel => {
      defaultChannel = channel;
      cy.fixture("addresses");
    })
    .then(addresses => {
      createShipping({
        channelId: defaultChannel.id,
        name,
        address: addresses.usAddress,
        price,
      });
    })
    .then(({ shippingMethod, shippingZone }) => ({
      shippingMethod,
      shippingZone,
      defaultChannel,
    }));
}
