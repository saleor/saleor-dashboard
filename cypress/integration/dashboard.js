// import { DASHBOARD_SELECTORS } from "../elements/dashboard/dashboard-selectors";

// // <reference types="cypress" />
// describe("User authorization", () => {
//     beforeEach(() => {
//         cy.clearSessionData().loginUserViaRequest();
//       });

//     xit("should all elements be visible on the dashboard", () => {
//         cy.visit("/");
//         softAssertVisibility(DASHBOARD_SELECTORS.sales);
//         softAssertVisibility(DASHBOARD_SELECTORS.orders);
//         softAssertVisibility(DASHBOARD_SELECTORS.activity);
//         softAssertVisibility(DASHBOARD_SELECTORS.topProducts);
//         softAssertVisibility(DASHBOARD_SELECTORS.ordersReadyToFulfill);
//         softAssertVisibility(DASHBOARD_SELECTORS.paymentsWaitingForCapture);
//         softAssertVisibility(DASHBOARD_SELECTORS.productsOutOfStock);
//     });

//     xit("aa", () => {
//         // cy.fixture('addresses').then((json) => {
//         //     cy.createCustomer("Test9","Test9", json.plAddress);
//         // });
//         // createChannel();
//         // createRateShipping();
//         // addChannelToProduct();
//         // createOrder();
//     });

//     function softAssertVisibility(selector){
//         const {softExpect} = chai;
//         cy.get(selector).then( element => {
//             softExpect(element).to.be.visible;
//         })
//     }
// });
