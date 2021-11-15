// / <reference types="Cypress" />
/**
 * Filter Cypress tests based on a given tag or tags. If no tags are present, run tests.
 *
 * @param {[string]} definedTags An array of tags
 * @param {Function} runTest All tests captured within a Cypress run
 * @example npm run open --env tags=api
 * version:
 * dev -run all
 * 3.1 -run eq or lower than 3.1
 */

const filterTests = ({ definedTags = ["all"], version = "1.0.0" }, runTest) => {
  let isTestAvailableInVersion = false;
  const shopVersion = Cypress.env("SHOP");
  if (shopVersion === "dev") {
    isTestAvailableInVersion = true;
  } else {
    const tagVersion = version.match("^\\d\\.\\d\\.\\d")[0].replaceAll(".", "");
    const numberVersion = shopVersion
      .match("^\\d\\.\\d\\.\\d")[0]
      .replaceAll(".", "");
    if (tagVersion <= numberVersion) {
      isTestAvailableInVersion = true;
    }
  }
  if (Cypress.env("tags")) {
    const tags = Cypress.env("tags").split("/");
    const isFound = definedTags.some($definedTag => tags.includes($definedTag));

    if (isFound && isTestAvailableInVersion) {
      runTest();
    }
  } else if (isTestAvailableInVersion) {
    runTest();
  }
};

export default filterTests;
