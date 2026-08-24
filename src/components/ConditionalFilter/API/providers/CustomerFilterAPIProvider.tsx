import { useApolloClient } from "@apollo/client";

import { type FilterContainer } from "../../FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { CustomerTypeHandler } from "../Handler";
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

    const rowType = filterElement.rowType();

    if (rowType === "customerType") {
      return new CustomerTypeHandler(client, inputValue).fetch();
    }

    return [];
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
