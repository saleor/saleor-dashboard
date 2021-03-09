import { getValueWithDefault } from "./utils/Utils";
export function createWarehouse(name, address, shippingZone, slug = name) {
  const shippingZones = getValueWithDefault(
    shippingZone,
    `shippingZones:"${shippingZone}"`
  );
  const mutation = `mutation{
                createWarehouse(input:{
                  name:"${name}"
                  slug:"${slug}"
                  ${shippingZones}
                  address:{
                    streetAddress1: "${address.streetAddress1}"
                    streetAddress2: "${address.streetAddress2}"
                    city: "${address.city}"
                    postalCode: "${address.postalCode}"
                    country: ${address.country}
                    phone: "${address.phone}"
                  }
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
  return cy.sendRequestWithQuery(mutation);
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
