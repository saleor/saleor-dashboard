class Product {
  getFirstProducts(first) {
    const query = `query{
            products(first:${first}){
              edges{
                node{
                  id
                  name
                  variants{
                    id
                  }
                }
              }
            }
          }
        `;
    return cy.sendRequestWithQuery(query);
  }

  updateChannelInProduct(productId, channelId) {
    const mutation = `mutation{
            productChannelListingUpdate(id:"${productId}", input:{
              addChannels:{
              channelId:"${channelId}"
                isPublished: true
                isAvailableForPurchase:true
                visibleInListings:true
            }
            }){
              product{
                id
                name
              }
            }
          }`;
    return cy.sendRequestWithQuery(mutation);
  }

  updateChannelPriceInVariant(variantId, channelId) {
    const mutation = `mutation{
      productVariantChannelListingUpdate(id: "${variantId}", input:{
        channelId: "${channelId}"
        price: 10
        costPrice: 10
      }){
        productChannelListingErrors{
          message
        }
      }
    }`;
    return cy.sendRequestWithQuery(mutation);
  }
}

export default Product;
