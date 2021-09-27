import { urlList } from "../../../fixtures/urlList";

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

export function inviteStaffMember({
  email,
  isActive = true,
  firstName = "",
  lastName = "",
  permissionId
}) {
  const mutation = `mutation createStaff{
    staffCreate(input:{
      firstName: "${firstName}"
      lastName: "${lastName}"
      email: "${email}",
      isActive: ${isActive},
      addGroups:"${permissionId}"
      redirectUrl: "${Cypress.config().baseUrl}${urlList.newPassword}"
    }){
      user{
        id
      }
      errors{
        field
        message
      }
    }
  }
  `;
  return cy.sendRequestWithQuery(mutation).its("body.data.staffCreate");
}

export function updateStaffMember({ userId, isActive }) {
  const mutation = `mutation{
    staffUpdate(id:"${userId}", input:{
      isActive:${isActive}
    }){
      user{
        id
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.staffUpdate");
}

export function deleteStaffMember(staffId) {
  const mutation = `mutation{
    staffDelete(id:"${staffId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.staffDelete");
}

export function deleteStaffMembersStartsWith(startsWith) {
  getStaffMembersStartsWith(startsWith).then(resp => {
    if (resp.body.data.staffUsers) {
      const staffMembers = resp.body.data.staffUsers.edges;
      staffMembers.forEach(element => {
        if (element.node.email.includes(startsWith)) {
          deleteStaffMember(element.node.id);
        }
      });
    }
  });
}
