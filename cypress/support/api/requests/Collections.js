export function createCollection(name, slug = name) {
  const mutation = `mutation {
    collectionCreate(input:{
      name:"${name}",
      slug:"${name}"
    }){
      errors{
        field
        message
      }
      collection{
        name
        id
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.collectionCreate.collection");
}

export function getCollections(first, search) {
  const filter = search
    ? `, filter:{
        search:"${search}"
      }`
    : "";
  const query = `query{
    collections(first:${first} ${filter}){
      edges{
        node{
          id
          name
          slug
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.collections.edges);
}
export function deleteCollection(collectionId) {
  const mutation = `mutation{
    collectionDelete(id:"${collectionId}"){
      collection{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addProductToCollection({ collectionId, productId }) {
  const mutation = `mutation addProduct {
    collectionAddProducts(
      collectionId: "${collectionId}"
      products: ["${productId}"]
    ) {
      collection{
        products(first:100){
          totalCount
          edges{
            node{
              id
              name
            }
          }
        }
      }
      errors {
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function addChannelToCollection({
  collectionId,
  channelId,
  isPublished = true,
}) {
  const mutation = `mutation collectionChannelListingUpdate {
    collectionChannelListingUpdate(
      id: "${collectionId}", 
      input: {
        addChannels: {
          channelId: "${channelId}"
          isPublished: ${isPublished}
        }
      }) {
      errors {
       field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
