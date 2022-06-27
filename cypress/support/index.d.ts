declare namespace Cypress {
  interface Chainable<Subject> {
    clearSessionData(): Chainable<any>;
    handleDeleteElement(
      element: {},
      deleteFunction: function,
      startsWith: string,
      name: string,
    ): Chainable<any>;
    deleteElementsStartsWith(
      deleteFunction: function,
      getFunction: function,
      startsWith: string,
      name? = string,
    ): Chainable<any>;
    expectCorrectFullAddress(
      responseAddress: string,
      expectedAddress: string,
    ): Chainable<any>;
    expectCorrectBasicAddress(
      responseAddress: string,
      expectedAddress: string,
    ): Chainable<any>;
    getTextFromElement(element: {}): Chainable<any>;
    clearAndType(subject: {}, text: string): Chainable<any>;
    loginUser(): Chainable<any>;
    loginInShop(): Chainable<any>;
    loginUserViaRequest(authorization?: string, user?: {}): Chainable<any>;
    assignElements(name: string, withLoader?: boolean): Chainable<any>;
    fillUpAddressFormAndSubmit(address: {}): Chainable<any>;
    fillUpAddressForm(address: {}): Chainable<any>;
    fillUpBasicAddress(address: {}): Chainable<any>;
    confirmationMessageShouldDisappear(): Chainable<any>;
    confirmationMessageShouldAppear(): Chainable<any>;
    waitForProgressBarToNotExist(): Chainable<any>;
    waitForProgressBarToNotBeVisible(): Chainable<any>;
    visitAndWaitForProgressBarToDisappear(url: string): Chainable<any>;
    fillBaseSelect(selectSelector: string, value: string): Chainable<any>;
    fillAutocompleteSelect(
      selectSelector: string,
      option?: string,
    ): Chainable<any>;
    addAliasToGraphRequest(alias: string): Chainable<any>;
    sendRequestWithQuery(query: string): Chainable<any>;
    fillMultiSelect(selectSelector: string, option: string): Chainable<any>;
    createNewOption(selectSelector: string, newOption: string): Chainable<any>;
    findElementsAndMakeActionOnTable({
      elementsGraphqlAlias: string,
      elementsName: string,
      elementsIds: string,
      actionFunction,
    }): Chainable<any>;
    searchInTable(query: string): Chainable<any>;
    waitForRequestAndCheckIfNoErrors(alias: string): Chainable<any>;
    deleteElementWithReqAlias(alias: string): Chainable<any>;
  }
}
