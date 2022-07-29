import * as warehouseRequest from "../requests/Warehouse";

export function deleteWarehouseStartsWith(startsWith) {
  cy.deleteElementsStartsWith(
    warehouseRequest.deleteWarehouse,
    warehouseRequest.getWarehouses,
    startsWith,
  );
}
