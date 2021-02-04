class Attribute {
  createAttribute(name) {
    const mutation = `mutation{
              attributeCreate(input:{
                name:"${name}"
                valueRequired:false
                type:PRODUCT_TYPE
              }){
                attribute{
                  id
                }
                attributeErrors{
                  field
                  message
                }
              }
            }`;
    return cy.sendRequestWithQuery(mutation);
  }

  getAttributes(first, search) {
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
    return cy.sendRequestWithQuery(mutation);
  }

  deleteAttribute(attributeId) {
    const mutation = `mutation{
              attributeDelete(id:"${attributeId}"){
                attributeErrors{
                  field
                  message
                }
              }
            }`;
    return cy.sendRequestWithQuery(mutation);
  }
}
export default Attribute;
