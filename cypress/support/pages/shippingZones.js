import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import { SHIPPING_ZONE_CHECKBOX } from "../../elements/shipping/shipping-zones-list";
import { urlList } from "../../fixtures/urlList";

export function enterAndSelectShippings(shippingIds) {
  cy.addAliasToGraphRequest("ShippingZones").visit(urlList.shippingMethods);
  selectShippingsOnTable(shippingIds);
}

export function selectShippingsOnTable(shippingIds, counter = 0) {
  cy.get(SHARED_ELEMENTS.skeleton)
    .should("not.exist")
    .wait("@ShippingZones")
    .its("response.body")
    .then(body => {
      const shippingResults = body.find(element => {
        if (element.data.shippingZones) {
          return element;
        }
      });
      const shippingList = shippingResults.data.shippingZones.edges;
      const notSelectedShippings = [];
      shippingIds.forEach(id => {
        const isShippingOnList = shippingList.find(
          element => element.node.id === id
        );
        if (isShippingOnList) {
          selectShippingZone(id);
          counter += 1;
        } else {
          notSelectedShippings.push(id);
        }
        if (counter === shippingIds.length) {
          return;
        }
      });
      if (counter === shippingIds.length) {
        return;
      }
      cy.get(BUTTON_SELECTORS.nextPaginationButton).click();
      selectShippingsOnTable(notSelectedShippings, counter);
    });
}

export function selectShippingZone(id) {
  cy.get(SHIPPING_ZONE_CHECKBOX(id)).click();
}
