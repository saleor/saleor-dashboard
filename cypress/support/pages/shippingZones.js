import {
  SHIPPING_ZONE_CHECKBOX,
  SHIPPING_ZONE_NAME
} from "../../elements/shipping/shipping-zones-list";
import { urlList } from "../../fixtures/urlList";

export function enterAndSelectShippings(
  shippingIds,
  actionFunction = selectShippingZone
) {
  cy.addAliasToGraphRequest("ShippingZones")
    .visit(urlList.shippingMethods)
    .findElementsAndMakeActionOnTable({
      elementsGraphqlAlias: "ShippingZones",
      elementsName: "shippingZones",
      elementsIds: shippingIds,
      actionFunction
    });
}

export function selectShippingZone(id) {
  cy.get(SHIPPING_ZONE_CHECKBOX(id)).click();
}

export function enterShippingZone(id) {
  cy.get(SHIPPING_ZONE_NAME(id)).click();
}
