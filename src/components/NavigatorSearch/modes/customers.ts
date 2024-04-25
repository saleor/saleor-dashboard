// @ts-strict-ignore
import { customerUrl } from "@dashboard/customers/urls";
import { SearchCustomersQuery } from "@dashboard/graphql";
import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { RelayToFlat } from "@dashboard/types";
import { IntlShape } from "react-intl";

import { QuickSearchAction } from "../types";
import messages from "./messages";

export function searchInCustomers(
  intl: IntlShape,
  navigate: UseNavigatorResult,
  customers: RelayToFlat<SearchCustomersQuery["search"]>,
): QuickSearchAction[] {
  return customers.map(customer => ({
    caption: customer.email,
    label:
      customer.firstName && customer.lastName
        ? intl.formatMessage(messages.customerWithName, {
            firstName: customer.firstName,
            lastName: customer.lastName,
          })
        : customer.email,
    onClick: () => {
      navigate(customerUrl(customer.id));

      return false;
    },
    score: 1,
    type: "customer",
  }));
}

function getCustomersModeActions(
  intl: IntlShape,
  navigate: UseNavigatorResult,
  customers: RelayToFlat<SearchCustomersQuery["search"]>,
): QuickSearchAction[] {
  return searchInCustomers(intl, navigate, customers);
}

export default getCustomersModeActions;
