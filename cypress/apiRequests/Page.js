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

export function createPage({ title, pageTypeId }) {
  const mutation = `mutation{
    pageCreate(input:{
      title:"${title}"
      pageType:"${pageTypeId}"
    }){
      errors{
        field
        message
      }
      page{
        title
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.pageCreate");
}
