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
