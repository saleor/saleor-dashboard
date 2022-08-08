import { getValueWithDefault } from "./utils/Utils";

export function getGiftCardWithTag(tag, withCode = false) {
  return getGiftCardsWithTag(1, tag, withCode)
    .its("body.data.giftCards.edges")
    .its(0)
    .its("node");
}

export function getGiftCardsWithTag(first, tag, withCode = false) {
  const codeLine = getValueWithDefault(withCode, `code`);
  const query = `query{
    giftCards(first: ${first}, filter: { code:"", tags: ["${tag}"]}){
      edges{
        node{
          ${codeLine}
          displayCode
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

export function getGiftCards(first) {
  const query = `query{
    giftCards(first: ${first}){
      edges{
        node{
          displayCode
          id
          isActive
          expiryDate
          tags{
            name
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

export function getGiftCardsWithCode(code) {
  const query = `query{
    giftCards(first:100, filter: { code: "${code}"}){
      edges{
        node{
          code
          displayCode
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
  return cy.sendRequestWithQuery(query).its("body.data.giftCards.edges");
}

export function getGiftCardWithId(id) {
  const query = `query{
    giftCard(id:"${id}"){
      isActive
      expiryDate
      tags{
        id
        name
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
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.giftCard");
}

export function createGiftCard(
  { tag, currency, amount, isActive = true },
  token,
) {
  const mutation = `mutation{
    giftCardCreate(input:{
      addTags:"${tag}"
      isActive: ${isActive}
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
    .sendRequestWithQuery(mutation, token)
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
