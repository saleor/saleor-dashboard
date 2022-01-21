import {
  deleteGiftCard,
  getGiftCardsWithTag,
  getGiftCardWithId
} from "../../requests/GiftCard";

export function deleteGiftCardsWithTagStartsWith(tag) {
  getGiftCardsWithTag(100, tag).then(resp => {
    const giftCardArray = resp.body.data.giftCards;
    if (giftCardArray) {
      giftCardArray.edges.forEach(element => {
        deleteGiftCard(element.node.id);
      });
    }
  });
}

export function isGiftCardDataAsExpected({
  giftCardId,
  expectedAmount,
  userEmail,
  initialBalance
}) {
  let dataAsExpected = true;
  return getGiftCardWithId(giftCardId).then(giftCard => {
    if (expectedAmount) {
      dataAsExpected = expectedAmount === giftCard.currentBalance.amount;
    }
    if (userEmail) {
      dataAsExpected = userEmail === giftCard.usedByEmail;
    }
    if (initialBalance) {
      dataAsExpected = initialBalance === giftCard.initialBalance.amount;
    }
    return dataAsExpected;
  });
}
