export function getPage(pageId, auth = "auth") {
  const query = `query{
    page(id:"${pageId}"){
      title
      isPublished
      attributes{
        values{
          inputType
          name
        }
        attribute{
          id
          inputType
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query, auth).its("body.data.page");
}
