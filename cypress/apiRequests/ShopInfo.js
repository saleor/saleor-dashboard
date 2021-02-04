class ShopInfo {
  getShopInfo() {
    const query = `query{
        shop{
          domain{
            url
          }
        }
      }`;
    return cy.sendRequestWithQuery(query);
  }
}
export default ShopInfo;
