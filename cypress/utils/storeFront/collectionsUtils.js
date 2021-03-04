import Collections from "../../apiRequests/storeFront/Collections";
import { isVisible } from "./utils";

const collectionsRequest = new Collections();

export const isCollectionVisible = (collectionId, channelSlug) =>
  isVisible({
    request: collectionsRequest.getCollection(collectionId, channelSlug),
    respObjectKey: ["collection"],
    responseValueKey: ["id"],
    value: collectionId
  });
export const isProductInCollectionVisible = (
  collectionId,
  channelSlug,
  productId
) =>
  isVisible({
    request: collectionsRequest.getCollection(collectionId, channelSlug),
    respObjectKey: ["collection", "products"],
    responseValueKey: ["edges", 0, "node", "id"],
    value: productId
  });
