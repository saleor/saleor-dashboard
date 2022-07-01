// / <reference types="cypress"/>
// / <reference types="../../../support"/>

import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { shippingZoneDetailsUrl } from "../../../fixtures/urlList";
import {
  createShippingZone,
  getShippingZone,
} from "../../../support/api/requests/ShippingMethod";
import { createWarehouse } from "../../../support/api/requests/Warehouse";
import { getDefaultChannel } from "../../../support/api/utils/channelsUtils";
import { deleteShippingStartsWith } from "../../../support/api/utils/shippingUtils";
import { fillUpShippingZoneData } from "../../../support/pages/shippingMethodPage";
import { enterAndSelectShippings } from "../../../support/pages/shippingZones";

describe("As a user I should be able to update and delete shipping zone", () => {
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
    createShippingZone(name, "US", defaultChannel.id).then(shippingZoneResp => {
      shippingZone = shippingZoneResp;
    });
  });

  it(
    "should be able to update shipping zone. TC: SALEOR_0808",
    { tags: ["@shipping", "@allEnv"] },
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
        expect(shippingZone.warehouses[0].name).to.eq(name);
        expect(shippingZone.countries.find(el => el.code === "PL")).to.be.ok;
      });
    },
  );

  it(
    "should be able to delete shipping zone. TC: SALEOR_0809",
    { tags: ["@shipping", "@allEnv"] },
    () => {
      cy.visit(
        shippingZoneDetailsUrl(shippingZone.id),
      ).deleteElementWithReqAlias("DeleteShippingZone");
      getShippingZone(shippingZone.id).should("be.null");
    },
  );

  it(
    "should be able to delete several shipping zones on shipping zones list page. TC: SALEOR_0810",
    { tags: ["@shipping", "@allEnv"] },
    () => {
      let secondShippingZone;

      createShippingZone(`${startsWith}Second`, "US", defaultChannel.id).then(
        shippingZoneResp => {
          secondShippingZone = shippingZoneResp;
          enterAndSelectShippings([shippingZone.id, secondShippingZone.id]);
          cy.get(BUTTON_SELECTORS.deleteSelectedElementsButton)
            .click()
            .addAliasToGraphRequest("BulkDeleteShippingZone")
            .get(BUTTON_SELECTORS.submit)
            .click()
            .wait("@BulkDeleteShippingZone");
          getShippingZone(shippingZone.id).should("be.null");
          getShippingZone(secondShippingZone.id).should("be.null");
        },
      );
    },
  );
});
