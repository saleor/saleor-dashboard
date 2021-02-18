class Category {
  createCategory(name, slug = name) {
    const mutation = `mutation{
                categoryCreate(input:{name:"${name}", slug: "${slug}"}){
                    productErrors{
                        field
                        message
                    }
                    category{
                        id
                    }
                }
            }`;
    return cy.sendRequestWithQuery(mutation);
  }
  getCategories(first, search) {
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
  deleteCategory(categoryId) {
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
}
export default Category;
