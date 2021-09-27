import { getValueWithDefault } from "./utils/Utils";

export function getPermissionGroups(first, startsWith) {
  const query = `query{
    permissionGroups(first:${first} filter:{
      search:"${startsWith}"
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
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.permissionGroups.edges);
}

export function deletePermissionGroup(permissionGroupId) {
  const mutation = `mutation{
    permissionGroupDelete(id:"${permissionGroupId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function createPermissionGroup({
  name,
  userIdsArray,
  permissionsArray
}) {
  const users = getValueWithDefault(userIdsArray, `addUsers:${userIdsArray}`);
  const mutation = `mutation{
    permissionGroupCreate(input:{
      name:"${name}"
      addPermissions:${permissionsArray}
      ${users}
    }){
      errors{
        field
        message
      }
      group{
        id
        name
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.permissionGroupCreate");
}

export function getPermissionGroup(permissionGroupId) {
  const query = `query{
    permissionGroup(id:"${permissionGroupId}"){
      id
      name
      users{
        email
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.permissionGroup");
}
