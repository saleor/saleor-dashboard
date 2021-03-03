// <reference types="cypress" />
import faker from "faker";

import { DRAFT_ORDER_SELECTORS } from "../../elements/orders/draft-order-selectors";
import { ORDERS_SELECTORS } from "../../elements/orders/orders-selectors";
import { selectChannelInPicker } from "../../steps/channelsSteps";
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
    selectChannelInPicker(defaultChannel.name);
    cy.get(DRAFT_ORDER_SELECTORS.addProducts).click();
    /*
        fulfill mandatory fields
        complete order
        check orders
        */
  });
});
