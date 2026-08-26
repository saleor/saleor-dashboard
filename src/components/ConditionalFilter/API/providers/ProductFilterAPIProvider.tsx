import { useApolloClient } from "@apollo/client";

import { type FilterContainer } from "../../FilterElement";
import { FilterQueryVarsBuilderResolver } from "../../FiltersQueryBuilder/FilterQueryVarsBuilderResolver";
import { type LeftOperand } from "../../LeftOperandsProvider";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { emptyChoicesPage, fetchHandlerPage } from "../filterChoicesPage";
import { AttributesHandler } from "../Handler";
import { getFilterElement } from "../utils";

const resolver = FilterQueryVarsBuilderResolver.getDefaultResolver();

export const useProductFilterAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
    after?: string | null,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    if (!filterElement) {
      return emptyChoicesPage();
    }

    const definition = resolver.resolve(filterElement);
    const handler = definition.createOptionFetcher(client, inputValue, filterElement);

    return fetchHandlerPage(handler, after);
  };

  const fetchAttributeOptions = async (inputValue: string, after?: string | null) => {
    const handler = new AttributesHandler(client, inputValue);

    return fetchHandlerPage<LeftOperand>(handler, after);
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
