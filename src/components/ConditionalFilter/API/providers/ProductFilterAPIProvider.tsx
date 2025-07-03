import { useApolloClient } from "@apollo/client";

import { FilterDefinitionResolver } from "../../filterDefinitions/FilterDefinitionResolver";
import { FilterContainer } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { AttributesHandler } from "../Handler";
import { getFilterElement } from "../utils";

const resolver = FilterDefinitionResolver.getDefaultResolver();

export const useProductFilterAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    if (!filterElement) {
      return Promise.resolve([]);
    }

    const definition = resolver.resolve(filterElement);
    const handler = definition.createOptionFetcher(client, inputValue, filterElement);

    return handler.fetch();
  };

  const fetchAttributeOptions = async (inputValue: string) => {
    const handler = new AttributesHandler(client, inputValue);

    return handler.fetch();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
