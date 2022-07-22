/// <reference types="cypress"/>
/// <reference types="../../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { WAREHOUSES_DETAILS } from "../../../elements/warehouses/warehouse-details";
import { WAREHOUSES_LIST } from "../../../elements/warehouses/warehouses-list";
import {
  shippingZoneDetailsUrl,
  urlList,
  warehouseDetailsUrl,
} from "../../../fixtures/urlList";
import { updateChannelWarehouses } from "../../../support/api/requests/Channels";
import {
  createShippingZone,
  createShippingZoneWithoutWarehouse,
} from "../../../support/api/requests/ShippingMethod";
import {
  createWarehouse as createWarehouseViaApi,
  getWarehouse,
} from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";

describe("As an admin I want to manage warehouses", () => {
  const startsWith = "CyWarehouse";
  let usAddress;
  let secondUsAddress;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    cy.fixture("addresses").then(addresses => {
      usAddress = addresses.usAddress;
      secondUsAddress = addresses.secondUsAddress;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it(
    "should be able to create warehouse. TC: SALEOR_1101",
    { tags: ["@warehouse", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      cy.visit(urlList.warehouses)
        .get(WAREHOUSES_LIST.createNewButton)
        .click()
        .get(WAREHOUSES_DETAILS.nameInput)
        .type(name)
        .fillUpBasicAddress(usAddress)
        .addAliasToGraphRequest("WarehouseCreate")
        .get(BUTTON_SELECTORS.confirm)
        .click()
        .waitForRequestAndCheckIfNoErrors("@WarehouseCreate")
        .its("response.body.data.createWarehouse.warehouse")
        .then(warehouse => {
          getWarehouse(warehouse.id);
        })
        .then(warehouse => {
          const addressResp = warehouse.address;
          expect(warehouse.name).to.be.eq(name);
          cy.expectCorrectBasicAddress(addressResp, usAddress);
        });
    },
  );

  it(
    "should be able to add warehouse to shipping zone. TC: SALEOR_1102",
    { tags: ["@warehouse", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let defaultChannel;
      let warehouse;
      let shippingZone;

      getDefaultChannel()
        .then(channelResp => {
          defaultChannel = channelResp;

          createWarehouseViaApi({
            name,
            address: usAddress,
          });
        })
        .then(warehouseResp => {
          warehouse = warehouseResp;

          updateChannelWarehouses(defaultChannel.id, warehouse.id);
          createShippingZoneWithoutWarehouse(name, "US", defaultChannel.id);
        })
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;

          cy.visit(shippingZoneDetailsUrl(shippingZone.id))
            .fillAutocompleteSelect(
              SHIPPING_ZONE_DETAILS.warehouseSelector,
              warehouse.name,
            )
            .addAliasToGraphRequest("UpdateShippingZone")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@UpdateShippingZone");
          getWarehouse(warehouse.id);
        })
        .then(warehouseResp => {
          expect(warehouseResp.shippingZones.edges[0].node.id).to.be.eq(
            shippingZone.id,
          );
        });
    },
  );

  it(
    "should be able to delete warehouse. TC: SALEOR_1103",
    { tags: ["@warehouse", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      createWarehouseViaApi({
        name,
        address: usAddress,
      }).then(warehouse => {
        cy.visit(warehouseDetailsUrl(warehouse.id))
          .get(BUTTON_SELECTORS.deleteButton)
          .click()
          .addAliasToGraphRequest("WarehouseDelete")
          .get(BUTTON_SELECTORS.submit)
          .click()
          .waitForRequestAndCheckIfNoErrors("@WarehouseDelete");
        getWarehouse(warehouse.id).should("be.null");
      });
    },
  );

  it(
    "should be able to remove warehouse from shipping zone. TC: SALEOR_1104",
    { tags: ["@warehouse", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      let defaultChannel;
      let warehouse;
      let shippingZone;

      getDefaultChannel()
        .then(channelResp => {
          defaultChannel = channelResp;

          createWarehouseViaApi({
            name,
            address: usAddress,
          }).then(warehouseResp => {
            warehouse = warehouseResp;

            updateChannelWarehouses(defaultChannel.id, warehouse.id);
            createShippingZone(name, "US", defaultChannel.id, warehouse.id);
          });
        })
        .then(shippingZoneResp => {
          shippingZone = shippingZoneResp;

          cy.visit(shippingZoneDetailsUrl(shippingZone.id))
            .get(SHIPPING_ZONE_DETAILS.removeWarehouseButton)
            .click()
            .addAliasToGraphRequest("UpdateShippingZone")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@UpdateShippingZone");
          getWarehouse(warehouse.id).then(warehouseResp => {
            expect(warehouseResp.shippingZones.edges).to.be.empty;
          });
        });
    },
  );

  it(
    "should be able to update warehouse. TC: SALEOR_1105",
    { tags: ["@warehouse", "@allEnv", "@stable"] },
    () => {
      const name = `${startsWith}${faker.datatype.number()}`;
      const updatedName = `${startsWith}${faker.datatype.number()}`;
      let warehouse;

      createWarehouseViaApi({
        name,
        address: usAddress,
      })
        .then(warehouseResp => {
          warehouse = warehouseResp;
          cy.visit(warehouseDetailsUrl(warehouse.id))
            .get(WAREHOUSES_DETAILS.nameInput)
            .clearAndType(updatedName)
            .fillUpBasicAddress(secondUsAddress)
            .addAliasToGraphRequest("WarehouseUpdate")
            .get(BUTTON_SELECTORS.confirm)
            .click()
            .waitForRequestAndCheckIfNoErrors("@WarehouseUpdate");
          getWarehouse(warehouse.id);
        })
        .then(warehouseResp => {
          const addressResp = warehouseResp.address;
          expect(warehouseResp.name).to.be.eq(updatedName);
          cy.expectCorrectBasicAddress(addressResp, secondUsAddress);
        });
    },
  );
});
