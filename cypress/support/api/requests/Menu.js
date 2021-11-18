export function getMenu(menuId) {
  const query = `query{
    menu(id:"${menuId}"){
      id
      name
      items{
        name
        category{
          name
        }
        collection{
          name
        }
        page{
          title
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.menu");
}

export function getMenus(first, search) {
  const mutation = `query{
    menus(first:${first}, filter:{
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
    .then(resp => resp.body.data.menus.edges);
}

export function deleteMenu(menuId) {
  const mutation = `mutation{
    menuDelete(id:"${menuId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createMenu(name) {
  const mutation = `mutation{
    menuCreate(input:{
      name:"${name}"
    }){
      errors{
        field
        message
      }
      menu{
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.menuCreate");
}
