import { useApolloClient } from "@apollo/client";
import { AttributeTypeEnum } from "@dashboard/graphql";

import { type FilterContainer } from "../../FilterElement";
import { customerFilterDefinitionResolver } from "../../queryVariables";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { AttributesHandler } from "../Handler";
import { getFilterElement } from "../utils";

export const useCustomerAPIProvider = (): FilterAPIProvider => {
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

    const definition = customerFilterDefinitionResolver.resolve(filterElement);
    const handler = definition.createOptionFetcher(client, inputValue, filterElement);

    return handler.fetch();
  };

  const fetchAttributeOptions = async (inputValue: string) => {
    const handler = new AttributesHandler(client, inputValue, AttributeTypeEnum.CUSTOMER_TYPE);

    return handler.fetch();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
