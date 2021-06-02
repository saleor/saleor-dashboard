// <reference types="cypress" />
import faker from "faker";

import { BUTTON_SELECTORS } from "../../../elements/shared/button-selectors";
import { WAREHOUSES_DETAILS } from "../../../elements/warehouses/warehouse-details";
import { WAREHOUSES_LIST } from "../../../elements/warehouses/warehouses-list";
import { fillUpBasicAddress } from "../../../steps/shared/addressForm";
import { urlList } from "../../../url/urlList";

describe("Warehouse settings", () => {
  const startsWith = "CyWarehouse:";

  beforeEach(() => {
    cy.clearSessionData().loginUserViaRequest();
  });

  it("should create warehouse", () => {
    const name = `${startsWith}${faker.datatype.number()}`;
    let usAddress;
    cy.visit(urlList.warehouses)
      .get(WAREHOUSES_LIST.createNewButton)
      .click()
      .fixture("addresses")
      .then(addresses => {
        usAddress = addresses.usAddress;
        cy.get(WAREHOUSES_DETAILS.nameInput).type(name);
        fillUpBasicAddress(usAddress);
        cy.addAliasToGraphRequest("WarehouseCreate")
          .get(BUTTON_SELECTORS.confirm)
          .click()
          .wait("@WarehouseCreate")
          .its("response.body.data.createWarehouse.warehouse");
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

  // it("should add warehouse to shipping zone", () => {

  // })

  // it("should delete warehouse", () => {

  // })
});
