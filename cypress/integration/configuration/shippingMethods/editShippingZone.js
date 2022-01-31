// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import { shippingZoneDetailsUrl } from "../../../fixtures/urlList";
import {
  createShippingZone,
  getShippingZone
} from "../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import filterTests from "../../../support/filterTests";
import { fillUpShippingZoneData } from "../../../support/pages/shippingMethodPage";

filterTests({ definedTags: ["all"] }, () => {
  describe("Edit shipping zone", () => {
    const startsWith = "EditShipping-";
    const name = `${startsWith}${faker.datatype.number()}`;

    let defaultChannel;
    let shippingZone;
    let plAddress;

    before(() => {
      cy.clearSessionData().loginUserViaRequest();
      deleteShippingStartsWith(startsWith);

      getDefaultChannel()
        .then(channel => {
          defaultChannel = channel;
          cy.fixture("addresses");
        })
        .then(addresses => {
          plAddress = addresses.plAddress;
          createWarehouse({ name, address: plAddress });
        });
    });

    beforeEach(() => {
      const rateName = `${startsWith}${faker.datatype.number()}`;

      cy.clearSessionData().loginUserViaRequest();
      createShippingZone(name, "US", defaultChannel.id).then(
        shippingZoneResp => {
          shippingZone = shippingZoneResp;
        }
      );
    });

    it("Update shipping zone", () => {
      const updatedName = `${startsWith}Updated`;

      cy.visit(shippingZoneDetailsUrl(shippingZone.id));
      fillUpShippingZoneData({
        channelName: defaultChannel.name,
        country: "Poland",
        shippingName: updatedName,
        warehouseName: name
      });
      getShippingZone(shippingZone.id).then(shippingZone => {
        chai.softExpect(shippingZone.channels).to.have.length(0);
        chai.softExpect(shippingZone.name).to.eq(updatedName);
        chai.softExpect(shippingZone.description).to.eq(updatedName);
        chai.softExpect(shippingZone.warehouses[0].name).to.eq(name);
        expect(shippingZone.countries.find(el => el.code === "PL")).to.be.ok;
      });
    });

    it("Delete shipping zone", () => {
      cy.visit(
        shippingZoneDetailsUrl(shippingZone.id)
      ).deleteElementWithReqAlias("DeleteShippingZone");
      getShippingZone(shippingZone.id).should("be.null");
    });
  });
});
