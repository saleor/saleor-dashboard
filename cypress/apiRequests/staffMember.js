export function getStaffMembersStartsWith(startsWith) {
  const query = `query{
    staffUsers(filter:{
      search:"${startsWith}"
    }){
      edges{
        node{
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
      redirectUrl: "http://localhost:9000/dashboard/new-password/"
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

export function deleteStaffMembersStartsWith(startsWith) {
  getStaffMembersStartsWith(startsWith).then(resp => {
    if (resp.body.data.staffUsers) {
      const staffMembers = resp.body.data.staffUsers.edges;
      staffMembers.forEach(element => {
        if (element.node.email.includes(startsWith)) {
          deleteCustomer(element.node.id);
        }
      });
    }
  });
}
