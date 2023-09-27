// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import { MESSAGES } from "../../../fixtures/";
import { shippingZoneDetailsUrl, urlList } from "../../../fixtures/urlList";
import { updateChannelWarehouses } from "../../../support/api/requests/Channels";
import {
  createShippingZone,
  getShippingZone,
} from "../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { fillUpShippingZoneData } from "../../../support/pages/shippingMethodPage";
import { typeShippingNameInSearch } from "../../../support/pages/shippingZones";

describe("As a user I should be able to update and delete shipping zone", () => {
  const startsWith = "EditShippingZ-";
  const name = `${startsWith}${faker.datatype.number()}`;

  let defaultChannel;
  let shippingZone;
  let plAddress;
  let warehouse;

  before(() => {
    cy.loginUserViaRequest();
    getDefaultChannel()
      .then(channel => {
        defaultChannel = channel;
        cy.fixture("addresses");
      })
      .then(addresses => {
        plAddress = addresses.plAddress;
        createWarehouse({ name, address: plAddress }).then(warehouseResp => {
          warehouse = warehouseResp;

          updateChannelWarehouses(defaultChannel.id, warehouse.id);
          cy.checkIfDataAreNotNull({
            defaultChannel,
            shippingZone,
            plAddress,
            warehouse,
          });
        });
      });
  });

  beforeEach(() => {
    cy.loginUserViaRequest();
    createShippingZone(name, "US", defaultChannel.id, warehouse.id).then(
      shippingZoneResp => {
        shippingZone = shippingZoneResp;
      },
    );
  });

  it(
    "should be able to update shipping zone. TC: SALEOR_0808",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const updatedName = `${startsWith}Updated`;

      cy.visit(shippingZoneDetailsUrl(shippingZone.id));
      fillUpShippingZoneData({
        channelName: defaultChannel.name,
        country: "Poland",
        shippingName: updatedName,
        warehouseName: name,
      });
      getShippingZone(shippingZone.id).then(shippingZone => {
        expect(shippingZone.channels).to.have.length(0);
        expect(shippingZone.name).to.eq(updatedName);
        expect(shippingZone.description).to.eq(updatedName);
        expect(shippingZone.warehouses).to.have.length(0);
        expect(shippingZone.countries.find(el => el.code === "PL")).to.be.ok;
      });
    },
  );

  it(
    "should be able to delete shipping zone. TC: SALEOR_0809",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      cy.visit(
        shippingZoneDetailsUrl(shippingZone.id),
      ).deleteElementWithReqAlias("DeleteShippingZone");
      getShippingZone(shippingZone.id).should("be.null");
    },
  );

  it(
    "should be able to delete shipping zones on shipping zones list page. TC: SALEOR_0810",
    { tags: ["@shipping", "@allEnv", "@stable"] },
    () => {
      const name = `${faker.datatype.number()}`;
      let secondShippingZone;
      cy.addAliasToGraphRequest("ShippingZones");
      cy.addAliasToGraphRequest("BulkDeleteShippingZone");
      createShippingZone(
        `e2e-shippinig-zone-${name}`,
        "US",
        defaultChannel.id,
        warehouse.id,
      ).then(shippingZoneResp => {
        secondShippingZone = shippingZoneResp;
        cy.visit(urlList.shippingMethods);
        typeShippingNameInSearch(shippingZone.name);
        cy.deleteFirstRecordFromGridListAndValidate(
          shippingZone.name,
          "BulkDeleteShippingZone",
          "ShippingZones",
        );
        cy.contains(MESSAGES.noShippingZonesFound).should("be.visible");
      });
    },
  );
});
