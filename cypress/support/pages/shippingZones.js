import { BUTTON_SELECTORS } from "../../elements/shared/button-selectors";
import { SHARED_ELEMENTS } from "../../elements/shared/sharedElements";
import {
  SHIPPING_ZONE_CHECKBOX,
  SHIPPING_ZONE_NAME
} from "../../elements/shipping/shipping-zones-list";
import { urlList } from "../../fixtures/urlList";

export function enterAndSelectShippings(
  shippingIds,
  actionFunction = selectShippingZone
) {
  cy.addAliasToGraphRequest("ShippingZones").visit(urlList.shippingMethods);
  selectShippingsOnTable(shippingIds, actionFunction);
}

export function selectShippingsOnTable(
  shippingIds,
  actionFunction = selectShippingZone,
  counter = 0
) {
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
      shippingIds = Array.isArray(shippingIds) ? shippingIds : [shippingIds];
      shippingIds.forEach(id => {
        const isShippingOnList = shippingList.find(
          element => element.node.id === id
        );
        if (isShippingOnList) {
          actionFunction(id);
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
      selectShippingsOnTable(notSelectedShippings, actionFunction, counter);
    });
}

export function selectShippingZone(id) {
  cy.get(SHIPPING_ZONE_CHECKBOX(id)).click();
}

export function enterShippingZone(id) {
  cy.get(SHIPPING_ZONE_NAME(id)).click();
}
