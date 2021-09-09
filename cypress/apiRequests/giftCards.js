export function getGiftCardWithTag(tag) {
  return getGiftCardsWithTag(1, tag)
    .its("body.data.giftCards.edges")
    .its(0)
    .its("node");
}

export function getGiftCardsWithTag(first, tag) {
  const query = `query{
    giftCards(first: ${first}, filter: { tag: "${tag}"}){
      edges{
        node{
          id
          code
          isActive
          expiryType
          expiryDate
          expiryPeriod{
            amount
            type
          }
          currentBalance{
            currency
            amount
          }
          initialBalance{
            currency
            amount
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query);
}

export function createGiftCard({ tag, expiryType, currency, amount }) {
  const mutation = `mutation{
    giftCardCreate(input:{
      tag:"${tag}"
      expirySettings: {
        expiryType: ${expiryType}
      }
      balance: {
        currency: "${currency}"
        amount: ${amount}
      }
    }){
      errors{
        field
        message
      }
      giftCard{
        code
        id
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.giftCardCreate.giftCard");
}

export function giftCardDeactivate(giftCardId) {
  const mutation = `mutation{
    giftCardDeactivate(id:"${giftCardId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function deleteGiftCard(giftCardId) {
  const mutation = `mutation{
    giftCardDelete(id:"${giftCardId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export const giftCardExpiryOptions = {
  NEVER_EXPIRE: "NEVER_EXPIRE"
};
