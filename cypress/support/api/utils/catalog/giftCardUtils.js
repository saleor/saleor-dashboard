import {
  deleteGiftCard,
  getGiftCards,
  getGiftCardWithId
} from "../../requests/GiftCard";
import {
  createCheckoutWithVoucher,
  purchaseProductWithPromoCode
} from "../ordersUtils";

export function deleteGiftCardsWithTagStartsWith(tag) {
  getGiftCards(100).then(resp => {
    const giftCardArray = resp.body.data.giftCards;
    if (giftCardArray) {
      giftCardArray.edges.forEach(element => {
        const includes = element.node.tags.find(element =>
          element.name.toLowerCase().includes(tag.toLowerCase())
        );
        if (includes) {
          deleteGiftCard(element.node.id);
        }
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

export function createCheckoutWithDisabledGiftCard({
  channelSlug,
  email = "email@example.com",
  variantsList,
  address,
  shippingMethodName,
  voucherCode,
  auth
}) {
  return createCheckoutWithVoucher({
    channelSlug,
    email,
    variantsList,
    address,
    shippingMethodName,
    voucherCode,
    auth
  }).then(({ addPromoCodeResp, checkout }) => {
    expect(addPromoCodeResp.errors[0].field).to.eq("promoCode");
    return checkout;
  });
}

export function purchaseProductWithActiveGiftCard({
  giftCard,
  expectedAmount,
  initialAmount,
  dataForCheckout,
  expectedOrderPrice
}) {
  return purchaseProductWithPromoCode(dataForCheckout).then(({ order }) => {
    expect(order.total.gross.amount).to.eq(expectedOrderPrice);
    expect(order.userEmail).to.eq(dataForCheckout.email);
    return isGiftCardDataAsExpected({
      giftCardId: giftCard.id,
      expectedAmount,
      userEmail: dataForCheckout.email,
      initialBalance: initialAmount
    });
  });
}
