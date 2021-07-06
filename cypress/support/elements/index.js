import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";

Cypress.Commands.add("getTextFromElement", element =>
  cy.get(element).invoke("text")
);

Cypress.Commands.add("clearAndType", { prevSubject: true }, (subject, text) => {
  cy.wrap(subject)
    .clear()
    .type(text);
});

Cypress.Commands.add("softExpectSkeletonIsVisible", () => {
  cy.get(SHARED_ELEMENTS.circularProgress).should("not.exist");
  cy.get("body").then($body => {
    if ($body.find(SHARED_ELEMENTS.skeleton).length) {
      cy.softAssertVisibility(SHARED_ELEMENTS.skeleton);
    } else {
      chai
        .softExpect(
          $body.find(SHARED_ELEMENTS.skeleton, "skeleton should exist").length
        )
        .to.be.eq(1);
    }
  });
});
