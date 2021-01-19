Cypress.Commands.add(
  "createCustomer",
  (email, name, address, isActive = false) => {
    const mustation = `
    mutation{
        customerCreate(input:{
        firstName: "${name}"
        lastName: "${name}"
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
            accountErrors{
                code
            }
        }
    }
    `;
  }
);
