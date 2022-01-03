import { SHARED_ELEMENTS } from "../../../elements/shared/sharedElements";

let isSoftAssertion = false;
let errors = [];

chai.softExpect = function(...args) {
  isSoftAssertion = true;
  return chai.expect(...args);
};
chai.softAssert = function(...args) {
  isSoftAssertion = true;
  return chai.assert(...args);
};

const origAssert = chai.Assertion.prototype.assert;
chai.Assertion.prototype.assert = function(...args) {
  if (isSoftAssertion) {
    try {
      origAssert.call(this, ...args);
    } catch (error) {
      errors.push(error);
    }
    isSoftAssertion = false;
  } else {
    origAssert.call(this, ...args);
  }
};

// monkey-patch `Cypress.log` so that the last `cy.then()` isn't logged to command log
const origLog = Cypress.log;
Cypress.log = function(data) {
  if (data && data.error && /soft assertions/i.test(data.error.message)) {
    data.error.message = "\n\n\t" + data.error.message + "\n\n";
    throw data.error;
  }
  return origLog.call(Cypress, ...arguments);
};

// monkey-patch `it` callback so we insert `cy.then()` as a last command
// to each test case where we'll assert if there are any soft assertion errors
function itCallback(func) {
  func();
  cy.then(() => {
    if (errors.length) {
      const _ = Cypress._;
      let msg = "";

      if (Cypress.browser.isHeaded) {
        msg = "Failed soft assertions... check log above ↑";
      } else {
        _.each(errors, error => {
          msg += "\n" + error;
        });

        msg = msg.replace(/^/gm, "\t");
      }

      throw new Error(msg);
    }
  });
}

const origIt = window.it;
window.it = (title, func) => {
  origIt(title, func && (() => itCallback(func)));
};
window.it.only = (title, func) => {
  origIt.only(title, func && (() => itCallback(func)));
};
window.it.skip = (title, func) => {
  origIt.skip(title, func);
};

beforeEach(() => {
  errors = [];
});
afterEach(() => {
  errors = [];
  isSoftAssertion = false;
});

Cypress.Commands.add("softAssertMatch", (selector, regexp) => {
  cy.get(selector)
    .invoke("text")
    .then(text =>
      chai.softExpect(assert.match(text, regexp, "regexp matches"))
    );
});

Cypress.Commands.add("softAssertVisibility", selector => {
  cy.get(selector).then(
    element =>
      chai.softExpect(element, "element should be visible").to.be.visible
  );
});

Cypress.Commands.add(
  "expectCorrectBasicAddress",
  (responseAddress, expectedAddress) => {
    chai
      .softExpect(responseAddress.city.toUpperCase())
      .to.eq(expectedAddress.city.toUpperCase());
    chai
      .softExpect(responseAddress)
      .to.have.property("countryArea", expectedAddress.countryArea);
    chai
      .softExpect(responseAddress)
      .to.have.property("phone", expectedAddress.phone);
    chai
      .softExpect(responseAddress)
      .to.have.property("postalCode", expectedAddress.postalCode);
    chai
      .softExpect(responseAddress)
      .to.have.property("streetAddress1", expectedAddress.streetAddress1);
    chai
      .softExpect(responseAddress)
      .to.have.property("streetAddress2", expectedAddress.streetAddress2);
  }
);

Cypress.Commands.add(
  "expectCorrectFullAddress",
  (responseAddress, expectedAddress) => {
    chai
      .softExpect(responseAddress)
      .to.have.property("firstName", expectedAddress.firstName);
    chai
      .softExpect(responseAddress)
      .to.have.property("firstName", expectedAddress.lastName);
    cy.expectCorrectBasicAddress(responseAddress, expectedAddress);
  }
);

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
