import { useApolloClient } from "@apollo/client";

import { type FilterContainer } from "../../FilterElement/FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { emptyAttributeChoicesPage, fetchHandlerPage } from "../filterChoicesPage";
import { PageTypesHandler } from "../Handler";
import { getFilterElement } from "../utils";

export const usePageAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
    after?: string | null,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const rowType = filterElement.rowType();

    if (rowType === "pageTypes") {
      return fetchHandlerPage(new PageTypesHandler(client, inputValue), after);
    }

    throw new Error(`Unknown filter element: "${rowType}"`);
  };

  const fetchAttributeOptions = async () => {
    return emptyAttributeChoicesPage();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
