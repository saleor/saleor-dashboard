import { useApolloClient } from "@apollo/client";

import { FilterContainer } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { PageTypesHandler } from "../Handler";
import { getFilterElement } from "../utils";

export const usePageAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const rowType = filterElement.rowType();

    if (rowType === "pageTypes") {
      return new PageTypesHandler(client, inputValue).fetch();
    }

    throw new Error(`Unknown filter element: "${rowType}"`);
  };

  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
