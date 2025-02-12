import { useApolloClient } from "@apollo/client";
import { PageTypesHandler } from "@dashboard/components/ConditionalFilter/API/Handler";
import {
  FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement";

import { FilterAPIProvider } from "../FilterAPIProvider";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

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
