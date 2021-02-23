// <reference types="cypress" />

describe("Sales discounts", () => {
  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    /*
        deleteSales
        delete products
        getDefaultChannel
        */
  });

  beforeEach(() => {
    cy.clearSessionData();
  });

  xit("should create percentage discount", () => {
    /*
        create new sale - percentage
        create product
        assign product to sale
        check price on storeFront
        */
  });

  xit("should create fixed price discount", () => {
    /*
        create new sale - fixed price
        create product
        assign product to sale
        check price on storeFront
        */
  });

  xit("should create not available for channel discount", () => {
    /*
        create new channel
        create new sale - in new channel
        create product
        assign product to sale
        check price on storeFront - in default channel
        */
  });
});
