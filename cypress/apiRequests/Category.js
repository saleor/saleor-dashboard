export function createCategory(name, slug = name) {
  const mutation = `mutation{
    categoryCreate(input:{name:"${name}", slug: "${slug}"}){
      productErrors{
        field
        message
      }
      category{
        id
        name
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.categoryCreate.category");
}

export function getCategory(categoryId) {
  const mutation = `query{
    category(id:"${categoryId}"){
      name
      description
      products{
        edges{
          node{
            name
          }
        }
      }
      children(first:100){
        edges{
          node{
            name
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.category");
}

export function getCategories(first, search) {
  const mutation = `query{
    categories(first:${first}, filter:{
      search:"${search}"
    }){
      edges{
        node{
          id
          name
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .then(resp => resp.body.data.categories.edges);
}

export function deleteCategory(categoryId) {
  const mutation = `mutation{
    categoryDelete(id:"${categoryId}"){
      productErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
