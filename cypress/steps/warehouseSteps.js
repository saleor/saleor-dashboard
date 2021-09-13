import { BUTTON_SELECTORS } from "../elements/shared/button-selectors";
import { WAREHOUSES_DETAILS } from "../elements/warehouses/warehouse-details";
import { WAREHOUSES_LIST } from "../elements/warehouses/warehouses-list";
import { urlList, warehouseDetailsUrl } from "../url/urlList";
import { fillUpBasicAddress } from "./shared/addressForm";

export function createWarehouse({ name, address }) {
  cy.visit(urlList.warehouses)
    .get(WAREHOUSES_LIST.createNewButton)
    .click();
  cy.get(WAREHOUSES_DETAILS.nameInput).type(name);
  fillUpBasicAddress(address);
  return cy
    .addAliasToGraphRequest("WarehouseCreate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@WarehouseCreate")
    .its("response.body.data.createWarehouse.warehouse");
}

export function enablePickup(warehouseId) {
  cy.visit(warehouseDetailsUrl(warehouseId))
    .get(WAREHOUSES_DETAILS.clickAndCollectEnabledRadioButton)
    .click();
  return saveWarehouseAfterUpdate();
}

export function setPublicStock(warehouseId) {
  cy.visit(warehouseDetailsUrl(warehouseId))
    .get(WAREHOUSES_DETAILS.clickAndCollectEnabledRadioButton)
    .click();
  return saveWarehouseAfterUpdate();
}

function saveWarehouseAfterUpdate() {
  return cy
    .addAliasToGraphRequest("WarehouseUpdate")
    .get(BUTTON_SELECTORS.confirm)
    .click()
    .wait("@WarehouseUpdate");
}
