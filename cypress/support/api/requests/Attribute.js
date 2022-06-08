export function createAttribute({
  name,
  attributeValues = ["value"],
  type = "PRODUCT_TYPE",
  inputType = "DROPDOWN",
  filterableInDashboard = false
}) {
  const values = attributeValues.map(element => `{name:"${element}"}`);
  const mutation = `mutation{
    attributeCreate(input:{
      name:"${name}"
      valueRequired:false
      type:${type}
      values: [${values}]
      inputType: ${inputType}
      filterableInDashboard: ${filterableInDashboard}
    }){
      attribute{
        id
        name
        slug
        choices(first: 100){
          edges{
            node{
              name
            }
          }
        }
      }
      errors{
        field
        message
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.attributeCreate.attribute");
}

export function getAttributes(first, search) {
  const mutation = `query{
    attributes(first:${first}, filter:{
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
    .then(resp => resp.body.data.attributes.edges);
}

export function deleteAttribute(attributeId) {
  const mutation = `mutation{
    attributeDelete(id:"${attributeId}"){
      errors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getAttribute(attributeId) {
  const query = `query{
    attribute(id:"${attributeId}"){
      id
      inputType
      name
      slug
      type
      entityType
      valueRequired
      visibleInStorefront
      availableInGrid
      unit
      choices{
        edges{
          node{
            file{
              contentType
            }
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.attribute");
}

export function updateAttribute({ attributeId, filterableInDashboard }) {
  const mutation = `mutation{
    attributeUpdate(id:"${attributeId}" input:{
      filterableInDashboard: ${filterableInDashboard}
    }){
    attribute{
      id
      filterableInDashboard
    }
   	errors{
    	field
    	message
    }
  }
}`;
  return cy.sendRequestWithQuery(mutation);
}
