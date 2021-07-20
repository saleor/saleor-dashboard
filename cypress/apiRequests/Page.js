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
