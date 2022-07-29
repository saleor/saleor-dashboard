import { getValueWithDefault } from "../utils/Utils";

export function getCollection({ collectionId, channelSlug, auth }) {
  cy.log(collectionId, channelSlug);

  const query = `query Collection{
    collection(id: "${collectionId}" channel: "${channelSlug}") {
      id
      slug
      name
      description
      channelListings{
        isPublished
      }
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
  }`;
  return cy.sendRequestWithQuery(query, auth).its("body.data");
}
