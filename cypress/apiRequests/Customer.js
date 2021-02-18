export class Customer {
  createCustomer(email, customerName, address, isActive = false) {
    const mutation = `
    mutation{
        customerCreate(input:{
        firstName: "${customerName}"
        lastName: "${customerName}"
        email: "${email}"
        isActive: ${isActive}
        defaultBillingAddress: {
            companyName: "${address.companyName}"
            streetAddress1: "${address.streetAddress1}"
            streetAddress2: "${address.streetAddress2}"
            city: "${address.city}"
            postalCode: "${address.postalCode}"
            country: ${address.country}
            phone: "${address.phone}"
        }
        defaultShippingAddress: {
            companyName: "${address.companyName}"
            streetAddress1: "${address.streetAddress1}"
            streetAddress2: "${address.streetAddress2}"
            city: "${address.city}"
            postalCode: "${address.postalCode}"
            country: ${address.country}
            phone: "${address.phone}"
        }
        }){
            user{
                id
                email
              }
            accountErrors{
                code
                message
            }
        }
    }
    `;
    return cy.sendRequestWithQuery(mutation);
  }

  deleteCustomers(startsWith) {
    this.getCustomers(startsWith).then(resp => {
      if (resp.body.data.customers) {
        const customers = resp.body.data.customers.edges;
        customers.forEach(element => {
          if (element.node.email.includes(startsWith)) {
            this.deleteCustomer(element.node.id);
          }
        });
      }
    });
  }

  deleteCustomer(customerId) {
    const mutation = `mutation{
          customerDelete(id:"${customerId}"){
            accountErrors{
              code
              message
            }
          }
        }`;
    return cy.sendRequestWithQuery(mutation);
  }

  getCustomers(startsWith) {
    const query = `query{
            customers(first:100, filter: {
                search: "${startsWith}"
              }){
              edges{
                node{
                  id
                  email
                }
              }
            }
          }
          `;
    return cy.sendRequestWithQuery(query);
  }
}
export default Customer;
