// @ts-strict-ignore
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useOrderDraftCreateMutation } from "@dashboard/graphql";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useNavigator from "@dashboard/hooks/useNavigator";
import { orderUrl } from "@dashboard/orders/urls";
import useCustomerSearch from "@dashboard/searches/useCustomerSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { RefObject, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import getModeActions from "./modes";
import { isQueryValidOrderNumber } from "./modes/orders";
import { getMode } from "./modes/utils";
import useSearchCatalog from "./queries/useCatalogSearch";
import { useQuickOrderSearch } from "./queries/useQuickOrderSearch";
import { QuickSearchAction, QuickSearchMode } from "./types";

type UseQuickSearch = [string, QuickSearchMode, FormChange, QuickSearchAction[]];
function useQuickSearch(open: boolean, input: RefObject<HTMLInputElement>): UseQuickSearch {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<QuickSearchMode>("default");
  const intl = useIntl();
  const navigate = useNavigator();
  const [{ data: orderData }, getOrderData] = useQuickOrderSearch();

  const { result: customers, search: searchCustomers } = useCustomerSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 10,
    },
    skip: !query,
  });
  const [{ data: catalog }, searchCatalog] = useSearchCatalog(10);
  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: result => {
      if (result.draftOrderCreate.errors.length === 0) {
        navigate(orderUrl(result.draftOrderCreate.order.id));
      }
    },
  });

  useModalDialogOpen(open, {
    onClose: () => {
      setMode("default");
      setQuery("");
    },
  });

  const handleBack = (event: KeyboardEvent) => {
    // `any` type because of poorly typed `KeyboardEvent.EventTarget` which
    // has no `value` key. Which it would have if `KeyboardEvent` and
    // `EventTarget` would be generic types accepting HTMLDOM element types.
    if ((event.target as any).value === "" && event.keyCode === 8) {
      setMode("default");
    }
  };

  useEffect(() => {
    setQuery("");

    const inputInstance = input.current;

    if (mode !== "default" && input.current) {
      inputInstance.addEventListener("keyup", handleBack);

      return () => {
        if (inputInstance) {
          inputInstance.removeEventListener("keyup", handleBack);
        }
      };
    }
  }, [mode, open]);

  const change = (event: ChangeEvent) => {
    const value = event.target.value;

    if (mode === "default" || mode === "help") {
      const newMode = getMode(value);

      if (newMode) {
        setMode(newMode);
      }
    }

    if (mode === "orders" && isQueryValidOrderNumber(value)) {
      getOrderData(value);
    }

    if (mode === "catalog") {
      searchCatalog(value);
    }

    if (mode === "customers") {
      searchCustomers(value);
    }

    setQuery(value);
  };

  return [
    query,
    mode,
    change,
    getModeActions(
      mode,
      query,
      intl,
      {
        catalog,
        customers: mapEdgesToItems(customers?.data?.search) || [],
        orders: mapEdgesToItems(orderData?.orders) || [],
      },
      {
        createOrder,
        navigate,
        setMode,
      },
    ),
  ];
}

export default useQuickSearch;
