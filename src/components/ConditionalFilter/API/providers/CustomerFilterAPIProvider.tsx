import { useApolloClient } from "@apollo/client";
import { AttributeTypeEnum } from "@dashboard/graphql";

import { type FilterContainer } from "../../FilterElement/FilterElement";
import { type LeftOperand } from "../../LeftOperandsProvider";
import { customerFilterDefinitionResolver } from "../../queryVariables";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { emptyChoicesPage, fetchHandlerPage } from "../filterChoicesPage";
import { AttributesHandler } from "../Handler";
import { getFilterElement } from "../utils";

export const useCustomerAPIProvider = (): FilterAPIProvider => {
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

    const definition = customerFilterDefinitionResolver.resolve(filterElement);
    const handler = definition.createOptionFetcher(client, inputValue, filterElement);

    return fetchHandlerPage(handler, after);
  };

  const fetchAttributeOptions = async (inputValue: string, after?: string | null) => {
    const handler = new AttributesHandler(client, inputValue, AttributeTypeEnum.CUSTOMER_TYPE);

    return fetchHandlerPage<LeftOperand>(handler, after);
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
