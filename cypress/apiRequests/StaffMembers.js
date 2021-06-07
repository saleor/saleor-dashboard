export function getStaffMembersStartsWith(startsWith) {
  const query = `query{
    staffUsers(first:100 filter:{
      search:"${startsWith}"
    }){
      edges{
        node{
          id
          email
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query);
}
