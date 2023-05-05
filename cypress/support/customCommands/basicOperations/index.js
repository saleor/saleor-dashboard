Cypress.Commands.add("getTextFromElement", element =>
  cy.get(element).invoke("text"),
);
Cypress.Commands.add("getRowSelectorWithNumber", rowNumber =>
  cy.get(`[data-value=${rowNumber}]`),
);

Cypress.Commands.add("clearAndType", { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).then(subject => {
    if (subject.find("[contenteditable]").length > 0) {
      cy.wrap(subject).find("[contenteditable]").clear().type(text);
    } else {
      cy.wrap(subject).clear({ force: true }).type(text);
    }
  });
});
Cypress.Commands.add("clickOnElement", selector => {
  cy.get(selector).click();
});

Cypress.Commands.add("waitForRequestAndCheckIfNoErrors", alias => {
  cy.wait(alias).then(resp => {
    expect(
      resp.response.body.errors,
      `No errors in ${alias} operation in graphql response`,
    ).to.be.undefined;
    return resp;
  });
});
Cypress.Commands.add("waitForRequestAndErrorMessage", (alias, error) => {
  cy.wait(alias).then(resp => {
    expect(resp.response.body.errors[0].message).to.contains(error);
    return resp;
  });
});

Cypress.Commands.add("checkIfDataAreNotNull", data => {
  expect(data, "Created data should not be null").to.be.not.null;
  if (typeof data === "object") {
    Object.keys(data).forEach(key => {
      cy.checkIfDataAreNotNull(data[key]);
    });
  } else if (Array.isArray(data)) {
    expect(data).not.to.be.empty;
    data.forEach(singleData => {
      cy.checkIfDataAreNotNull(singleData);
    });
  }
});
Cypress.Commands.add("checkIfElementIsVisible", element => {
  cy.get(element).should("be.visible");
});
Cypress.Commands.add("checkIfElementIsNotVisible", element => {
  cy.get(element).should("not.be.visible");
});
Cypress.Commands.add("checkIfElementExist", element => {
  cy.get(element).should("exist");
});
Cypress.Commands.add("checkIfElementNotExist", element => {
  cy.get(element).should("not.exist");
});
Cypress.Commands.add("assertCanvasRowsNumber", (canvas, rowNumber) => {
  cy.get(canvas).find("tr").should("have.length", rowNumber);
});
