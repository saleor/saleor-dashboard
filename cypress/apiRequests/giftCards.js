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
          code
          id
          isActive
          expiryDate
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

export function getGiftCardWithId(id) {
  const query = `query{
    giftCard(id:"${id}"){
      isActive
      currentBalance{
        currency
        amount
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.giftCard");
}

export function createGiftCard({ tag, currency, amount }) {
  const mutation = `mutation{
    giftCardCreate(input:{
      tag:"${tag}"
      isActive: true
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
        isActive
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
