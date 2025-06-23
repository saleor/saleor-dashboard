import { useApolloClient } from "@apollo/client";

import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { AttributesHandler } from "../Handler";
import { FilterStrategyResolver } from "../strategies/FilterStrategyResolver";
import { getFilterElement } from "../utils";

const strategyResolver = FilterStrategyResolver.getResolver();

export const useProductFilterAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index) as FilterElement;

    const strategy = strategyResolver.resolve(filterElement);
    const handler = strategy.createHandler(client, inputValue, filterElement);

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
