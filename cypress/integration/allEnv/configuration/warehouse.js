// <reference types="cypress" />
import faker from "faker";

import { createShippingZone } from "../../../apiRequests/ShippingMethod";
import { createWarehouse, getWarehouse } from "../../../apiRequests/Warehouse";
import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { SHIPPING_ZONE_DETAILS } from "../../../elements/shipping/shipping-zone-details";
import { WAREHOUSES_DETAILS } from "../../../elements/warehouses/warehouse-details";
import { WAREHOUSES_LIST } from "../../../elements/warehouses/warehouses-list";
import { fillUpBasicAddress } from "../../../steps/shared/addressForm";
import { fillAutocompleteSelect } from "../../../steps/shared/autocompleteSelect";
import {
  shippingZoneDetailsUrl,
  urlList,
  warehouseDetailsUrl
} from "../../../url/urlList";
import { getDefaultChannel } from "../../../utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../utils/shippingUtils";

describe("Warehouse settings", () => {
  const startsWith = "CyWarehouse";
  let usAddress;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteShippingStartsWith(startsWith);
    cy.fixture("addresses").then(addresses => {
      usAddress = addresses.usAddress;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create warehouse", () => {
    const name = `${startsWith}${faker.datatype.number()}`;
    cy.visit(urlList.warehouses)
      .get(WAREHOUSES_LIST.createNewButton)
      .click();
    cy.get(WAREHOUSES_DETAILS.nameInput).type(name);
    fillUpBasicAddress(usAddress);
    cy.addAliasToGraphRequest("WarehouseCreate")
      .get(BUTTON_SELECTORS.confirm)
      .click()
      .wait("@WarehouseCreate")
      .its("response.body.data.createWarehouse.warehouse")
      .then(warehouse => {
        getWarehouse(warehouse.id);
      })
      .then(warehouse => {
        const addressResp = warehouse.address;
        expect(warehouse.name).to.be.eq(name);
        expect(addressResp).to.have.property(
          "city",
          usAddress.city.toUpperCase()
        );
        expect(addressResp).to.have.property(
          "countryArea",
          usAddress.countryArea
        );
        expect(addressResp).to.have.property("phone", usAddress.phone);
        expect(addressResp).to.have.property(
          "postalCode",
          usAddress.postalCode
        );
        expect(addressResp).to.have.property(
          "streetAddress1",
          usAddress.streetAddress1
        );
        expect(addressResp).to.have.property(
          "streetAddress2",
          usAddress.streetAddress2
        );
      });
  });

  it("should add warehouse to shipping zone", () => {
    const name = `${startsWith}${faker.datatype.number()}`;
    let defaultChannel;
    let warehouse;
    let shippingZone;

    getDefaultChannel()
      .then(channelResp => {
        defaultChannel = channelResp;
        createWarehouse({
          name,
          address: usAddress
        });
      })
      .then(warehouseResp => {
        warehouse = warehouseResp;
        createShippingZone(name, "US", defaultChannel.id);
      })
      .then(shippingZoneResp => {
        shippingZone = shippingZoneResp;
        cy.visit(shippingZoneDetailsUrl(shippingZone.id));
        fillAutocompleteSelect(
          SHIPPING_ZONE_DETAILS.warehouseSelector,
          warehouse.name
        );
        cy.addAliasToGraphRequest("UpdateShippingZone")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@UpdateShippingZone");
        getWarehouse(warehouse.id);
      })
      .then(warehouseResp => {
        expect(warehouseResp.shippingZones.edges[0].node.id).to.be.eq(
          shippingZone.id
        );
      });
  });

  it("should delete warehouse", () => {
    const name = `${startsWith}${faker.datatype.number()}`;
    createWarehouse({
      name,
      address: usAddress
    }).then(warehouse => {
      cy.visit(warehouseDetailsUrl(warehouse.id))
        .get(BUTTON_SELECTORS.deleteButton)
        .click()
        .addAliasToGraphRequest("WarehouseDelete")
        .get(BUTTON_SELECTORS.submit)
        .click()
        .wait("@WarehouseDelete");
      getWarehouse(warehouse.id).should("be.null");
    });
  });
});
