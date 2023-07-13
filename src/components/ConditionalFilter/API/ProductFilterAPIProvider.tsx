import { ApolloClient, useApolloClient } from "@apollo/client";

import { RowType } from "../constants";
import { FilterContainer, FilterElement } from "../FilterElement";
import { FetchingParams } from "../ValueProvider/TokenArray/fetchingParams";
import { FilterAPIProvider } from "./FilterAPIProvider";
import {
  AttributeChoicesHandler,
  AttributesHandler,
  BooleanValuesHandler,
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  Handler,
  ProductTypeHandler,
} from "./Handler";
import {
  createInitialStateFromData,
  useDataFromAPI,
} from "./initialState/helpers";
import { InitialStateResponse } from "./InitialStateResponse";

const getFilterElement = (
  value: FilterContainer,
  index: number,
): FilterElement => {
  const possibleFilterElement = value[index];
  if (
    typeof possibleFilterElement !== "string" &&
    !Array.isArray(possibleFilterElement)
  ) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

const isStaticBoolean = (rowType: RowType) => {
  return [
    "isAvailable",
    "isPublished",
    "isVisibleInListing",
    "hasCategory",
    "giftCard"
  ].includes(rowType)
}

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
): Handler => {
  const rowType = selectedRow.rowType()

  if (rowType === "attribute") {
    return new AttributeChoicesHandler(
      client,
      selectedRow.value.value,
      inputValue,
    );
  }

  if (rowType && isStaticBoolean(rowType)) {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: rowType,
        slug: "true"
      },
      {
        label: "No",
        value: "false",
        type: rowType,
        slug: "false"
      }
    ])
  }

  if (rowType === "collection") {
    return new CollectionHandler(client, inputValue);
  }

  if (rowType === "category") {
    return new CategoryHandler(client, inputValue);
  }

  if (rowType === "productType") {
    return new ProductTypeHandler(client, inputValue);
  }

  if (rowType === "channel") {
    return new ChannelHandler(client, inputValue);
  }

  throw new Error("Unknown filter element");
};

export const useProductFilterAPIProvider = (): FilterAPIProvider => {
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

  const fetchLeftOptions = async (inputValue: string) => {
    const handler = new AttributesHandler(client, inputValue);
    return handler.fetch();
  };

  const useInitialState = (fetchingParams: FetchingParams) => {
    const { data, loading } = useDataFromAPI({
      ...fetchingParams,
    });

    const initialState = createInitialStateFromData(
      data,
      fetchingParams.channel,
    );

    return {
      data: new InitialStateResponse(
        initialState.category,
        initialState.attribute,
        initialState.channel,
        initialState.collection,
        initialState.productType,
        initialState.isAvailable,
        initialState.isPublished,
        initialState.isVisibleInListing,
        initialState.hasCategory,
        initialState.giftCard
      ),
      loading,
    };
  };

  return {
    fetchRightOptions,
    fetchLeftOptions,
    useInitialState,
  };
};
