import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

Cypress.Commands.add("assertVisibility", selector => {
  cy.get(selector).then(
    element => expect(element, "element should be visible").to.be.visible,
  );
});

Cypress.Commands.add(
  "expectCorrectBasicAddress",
  (responseAddress, expectedAddress) => {
    expect(responseAddress.city.toUpperCase()).to.eq(
      expectedAddress.city.toUpperCase(),
    );
    expect(responseAddress).to.have.property(
      "countryArea",
      expectedAddress.countryArea,
    );
    expect(responseAddress).to.have.property("phone", expectedAddress.phone);
    expect(responseAddress).to.have.property(
      "postalCode",
      expectedAddress.postalCode,
    );
    expect(responseAddress).to.have.property(
      "streetAddress1",
      expectedAddress.streetAddress1,
    );
    expect(responseAddress).to.have.property(
      "streetAddress2",
      expectedAddress.streetAddress2,
    );
  },
);

Cypress.Commands.add(
  "expectCorrectFullAddress",
  (responseAddress, expectedAddress) => {
    expect(responseAddress).to.have.property(
      "firstName",
      expectedAddress.firstName,
    );
    expect(responseAddress).to.have.property(
      "firstName",
      expectedAddress.lastName,
    );
    cy.expectCorrectBasicAddress(responseAddress, expectedAddress);
  },
);

Cypress.Commands.add("expectSkeletonIsVisible", () => {
  cy.get(SHARED_ELEMENTS.circularProgress).should("not.exist");
  cy.get(SHARED_ELEMENTS.progressBar).should("be.visible");
  cy.get("body").then($body => {
    if ($body.find(SHARED_ELEMENTS.skeleton).length) {
      cy.assertVisibility(SHARED_ELEMENTS.skeleton);
    } else {
      expect(
        $body.find(SHARED_ELEMENTS.skeleton, "skeleton should exist").length,
      ).to.be.eq(1);
    }
  });
});

Cypress.Commands.add("waitForSkeletonToDisappear", () => {
  cy.get(SHARED_ELEMENTS.skeleton)
    .should("be.visible")
    .get(SHARED_ELEMENTS.skeleton)
    .should("not.exist");
});
