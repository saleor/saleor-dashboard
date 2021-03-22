import { LEFT_MENU_SELECTORS } from "../elements/account/left-menu/left-menu-selectors";
import { CONFIGURATION_SELECTORS } from "../elements/configuration/configuration-selectors";
import { ONE_PERMISSION_USERS } from "./users";

export const PERMISSIONS = {
  shipping: {
    user: ONE_PERMISSION_USERS.shipping,
    parent: {
      parentMenuSelector: LEFT_MENU_SELECTORS.configuration,
      parentSelectors: CONFIGURATION_SELECTORS
    },
    pageMenuSelector: CONFIGURATION_SELECTORS.shipping
  },
  discount: {
    user: ONE_PERMISSION_USERS.discount,
    pageMenuSelector: LEFT_MENU_SELECTORS.discount
  }
};
