// <reference types="cypress" />
import faker from "faker";

import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { urlList } from "../../url/urlList";
import { getDefaultChannel } from "../../utils/channelsUtils";

describe("Channels in draft orders", () => {
  const startsWith = "Cy-";

  let defaultChannel;

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    getDefaultChannel().then(channel => {
      defaultChannel = channel;
    });
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should move draft order to orders", () => {
    cy.visit(urlList.orders)
      .get(ORDERS_SELECTORS.createOrder)
      .click();
    /*
        visit orders
        create order
        fulfill mandatory fields
        complete order
        check orders
        */
  });
});
