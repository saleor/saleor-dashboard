import { getValueWithDefault } from "../utils/Utils";

export function getCollection({ collectionId, channelSlug, auth = "token" }) {
  const channelLine = getValueWithDefault(
    channelSlug,
    `channel: "${channelSlug}"`
  );
  const query = `query Collection{
    collection(id: "${collectionId}" ${channelLine}) {
      id
      slug
      name
      description
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
