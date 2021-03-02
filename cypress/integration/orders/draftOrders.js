// <reference types="cypress" />
import faker from "faker";

import ChannelsUtils from "../../utils/channelsUtils";

describe("Channels in draft orders", () => {
  const startsWith = "Cy-";
  const channelsUtils = new ChannelsUtils();

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    /*
        get default channel
        */
  });

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should move draft order to orders", () => {
    /*
        visit orders
        create order
        fulfill mandatory fields
        complete order
        check orders
        */
  });
});
