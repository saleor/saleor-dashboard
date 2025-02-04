import { ApolloClient, useApolloClient } from "@apollo/client";

import { RowType } from "../constants";
import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterAPIProvider } from "./FilterAPIProvider";
import { BooleanValuesHandler, ChannelHandler, Handler, NoopValuesHandler } from "./Handler";

const isStaticBoolean = (rowType: RowType) => {
  return ["published"].includes(rowType);
};

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};
const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType && isStaticBoolean(rowType) && rowType !== "attribute") {
    return new BooleanValuesHandler([
      {
        label: "True",
        value: "PUBLISHED",
        type: rowType,
        slug: "published",
      },
      {
        label: "False",
        value: "HIDDEN",
        type: rowType,
        slug: "hidden",
      },
    ]);
  }

  if (rowType === "ids") {
    return new NoopValuesHandler([]);
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
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, client, inputValue);

    return handler.fetch();
  };
  const fetchLeftOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
  };
};
