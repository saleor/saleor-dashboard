import { customerUrl } from "@saleor/customers/urls";
import { UseNavigatorResult } from "@saleor/hooks/useNavigator";
import { SearchCustomers_search_edges_node } from "@saleor/searches/types/SearchCustomers";
import { IntlShape } from "react-intl";

import { QuickSearchAction } from "../types";
import messages from "./messages";

export function searchInCustomers(
  intl: IntlShape,
  navigate: UseNavigatorResult,
  customers: SearchCustomers_search_edges_node[]
): QuickSearchAction[] {
  return customers.map(customer => ({
    caption: customer.email,
    label:
      customer.firstName && customer.lastName
        ? intl.formatMessage(messages.customerWithName, {
            firstName: customer.firstName,
            lastName: customer.lastName
          })
        : customer.email,
    onClick: () => {
      navigate(customerUrl(customer.id));
      return false;
    },
    score: 1,
    type: "customer"
  }));
}

function getCustomersModeActions(
  intl: IntlShape,
  navigate: UseNavigatorResult,
  customers: SearchCustomers_search_edges_node[]
): QuickSearchAction[] {
  return searchInCustomers(intl, navigate, customers);
}

export default getCustomersModeActions;
