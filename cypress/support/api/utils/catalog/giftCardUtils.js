import { deleteGiftCard, getGiftCards } from "../../requests/GiftCard";

export function deleteGiftCardsWithTagStartsWith(tag) {
  getGiftCards(100).then(resp => {
    const giftCardArray = resp.body.data.giftCards;
    if (giftCardArray) {
      giftCardArray.edges.forEach(element => {
        const includes = element.node.tags.find(element =>
          element.name.includes(tag.toLowerCase())
        );
        if (includes) {
          deleteGiftCard(element.node.id);
        }
      });
    }
  });
}
