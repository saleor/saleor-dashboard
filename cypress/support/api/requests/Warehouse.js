import { getDefaultAddress, getValueWithDefault } from "./utils/Utils";

export function createWarehouse({ name, shippingZone, address, slug = name }) {
  const shippingZoneLine = getValueWithDefault(
    shippingZone,
    `shippingZones:"${shippingZone}"`
  );
  const mutation = `mutation{
    createWarehouse(input:{
      name:"${name}"
      slug:"${slug}"
      ${shippingZoneLine}
      ${getDefaultAddress(address, "address", false)}
    }){
      warehouseErrors{
        field
        message
      }
      warehouse{
        id
        name
      }
    }
  }`;
  return cy
    .sendRequestWithQuery(mutation)
    .its("body.data.createWarehouse.warehouse");
}

export function getWarehouses(first, search) {
  const query = `query{
    warehouses(first:${first}, filter:{
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
    .sendRequestWithQuery(query)
    .then(resp => resp.body.data.warehouses.edges);
}

export function deleteWarehouse(warehouseId) {
  const mutation = `mutation{
    deleteWarehouse(id:"${warehouseId}"){
      warehouseErrors{
        field
        message
      }
    }
  }`;
  return cy.sendRequestWithQuery(mutation);
}

export function getWarehouse(warehouseId) {
  const query = `query{
    warehouse(id:"${warehouseId}"){
      id
      name
      address{
        companyName
        streetAddress1
        streetAddress2
        city
        postalCode
        countryArea
        phone
      }
      shippingZones(first:100){
        edges{
          node{
            id
          }
        }
      }
    }
  }`;
  return cy.sendRequestWithQuery(query).its("body.data.warehouse");
}
