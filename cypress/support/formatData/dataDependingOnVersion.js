export function returnValueDependsOnShopVersion(
  version,
  equalOrGreaterValue,
  lessThenValue = ""
) {
  return Cypress.env("SHOP") === "dev" ||
    Cypress.env("SHOP").replaceAll(".", "") >= version.replaceAll(".", "")
    ? equalOrGreaterValue
    : lessThenValue;
}
