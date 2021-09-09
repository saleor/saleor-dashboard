import { deleteGiftCard, getGiftCardsWithTag } from "../apiRequests/giftCards";

export function deleteGiftCardsWithTagStartsWith(tag) {
  getGiftCardsWithTag(100, tag).then(resp => {
    resp.body.data.giftCards.edges.forEach(element => {
      deleteGiftCard(element.node.id);
    });
  });
}
