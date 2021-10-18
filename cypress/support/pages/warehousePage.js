import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { WAREHOUSES_DETAILS } from "../../elements/warehouses/warehouse-details";
import { WAREHOUSES_LIST } from "../../elements/warehouses/warehouses-list";
import { urlList, warehouseDetailsUrl } from "../../fixtures/urlList";

export function createWarehouse({ name, address }) {
  return cy
    .visit(urlList.warehouses)
    .get(WAREHOUSES_LIST.createNewButton)
    .click()
    .get(WAREHOUSES_DETAILS.nameInput)
    .type(name)
    .fillUpBasicAddress(address)
    .addAliasToGraphRequest("WarehouseCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@WarehouseCreate")
    .its("response.body.data.createWarehouse.warehouse");
}

export function visitAndEnablePickup(
  warehouseId,
  pickup = enableAllWarehousesPickup
) {
  cy.visit(warehouseDetailsUrl(warehouseId));
  pickup();
  return saveWarehouseAfterUpdate();
}

export function visitSetPublicStockAndEnablePickup(
  warehouseId,
  pickup = enableAllWarehousesPickup
) {
  cy.visit(warehouseDetailsUrl(warehouseId))
    .get(WAREHOUSES_DETAILS.publicRadioButton)
    .click();
  pickup();
  return saveWarehouseAfterUpdate();
}

export function enableAllWarehousesPickup() {
  return cy
    .get(WAREHOUSES_DETAILS.clickAndCollectAllWarehousesRadioButton)
    .click();
}

export function enableLocalStockOnlyPickup() {
  return cy
    .get(WAREHOUSES_DETAILS.clickAndCollectLocalStockRadioButton)
    .click();
}

function saveWarehouseAfterUpdate() {
  return cy
    .addAliasToGraphRequest("WarehouseUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@WarehouseUpdate");
}

export const pickupOptions = {
  allWarehouses: enableAllWarehousesPickup,
  local: enableLocalStockOnlyPickup
};
