export function getPermissionsArray(first) {
  const query = `query{
    permissionGroups(first:${first}){
      edges{
        node{
          id
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.permissionGroups.edges");
}
