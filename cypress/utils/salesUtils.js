import Sales from "../apiRequests/Sales";

class SalesUtils {
  deleteProperSales(startsWith) {
    const sales = new Sales();
    cy.deleteProperElements(
      sales.deleteSale,
      sales.getSales,
      startsWith,
      "sales"
    );
  }
}
export default SalesUtils;
