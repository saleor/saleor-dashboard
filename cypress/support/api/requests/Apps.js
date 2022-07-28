export function createApp(name, permission) {
  const mutation = `mutation{
    appCreate(input:{name:"${name}" permissions:${permission}}){
      authToken
      errors{
        field
        message
      }
      app{
        id
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation).its("body.data.appCreate");
}

export function getApps(first, search) {
  const mutation = `query{
    apps(filter:{ search: "${search}"} first: ${first}){
      edges{
        node{
          name
          id
        }
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .then(resp => resp.body.data.apps.edges);
}

export function deleteApp(appId) {
  const mutation = `mutation{
    appDelete(id:"${appId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getApp(appId) {
  const query = `query{
    app(id:"${appId}"){
      name
      permissions{
        code
      }
      tokens{
        name
        authToken
      }
      webhooks{
        name
        targetUrl
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.app");
}

export function updateApp(appId, permission) {
  const mutation = `mutation{
    appUpdate(id:"${appId}" input:{permissions: [${permission}]}){
      errors{
        code
      }
      app{
        permissions{
          name
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}
