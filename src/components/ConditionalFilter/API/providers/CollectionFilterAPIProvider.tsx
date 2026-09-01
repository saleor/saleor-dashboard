import { type ApolloClient, useApolloClient } from "@apollo/client";

import { type FilterContainer, type FilterElement } from "../../FilterElement/FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { emptyAttributeChoicesPage, fetchHandlerPage } from "../filterChoicesPage";
import { BooleanValuesHandler, ChannelHandler, type Handler, NoopValuesHandler } from "../Handler";
import { getFilterElement } from "../utils";

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType === "published") {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: rowType,
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        type: rowType,
        slug: "false",
      },
    ]);
  }

  if (rowType === "metadata") {
    return new NoopValuesHandler([]);
  }

  if (rowType === "channel") {
    return new ChannelHandler(client, inputValue);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useCollectionFilterAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
    after?: string | null,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, client, inputValue);

    return fetchHandlerPage(handler, after);
  };

  const fetchAttributeOptions = async () => {
    return emptyAttributeChoicesPage();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
