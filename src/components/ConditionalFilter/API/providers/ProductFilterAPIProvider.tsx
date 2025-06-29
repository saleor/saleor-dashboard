import { ApolloClient, useApolloClient } from "@apollo/client";
import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { RowType } from "../../constants";
import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import {
  AttributeChoicesHandler,
  AttributesHandler,
  BooleanValuesHandler,
  CategoryHandler,
  ChannelHandler,
  CollectionHandler,
  Handler,
  ProductTypeHandler,
} from "../Handler";
import { getFilterElement } from "../utils";

const isStaticBoolean = (rowType: RowType) => {
  return [
    "isAvailable",
    "isPublished",
    "isVisibleInListing",
    "hasCategory",
    "giftCard",
    "price",
  ].includes(rowType);
};
const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType === "attribute" && selectedRow.value.type === "BOOLEAN") {
    return new BooleanValuesHandler([
      {
        label: "Yes",
        value: "true",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "true",
      },
      {
        label: "No",
        value: "false",
        type: AttributeInputTypeEnum.BOOLEAN,
        slug: "false",
      },
    ]);
  }

  if (rowType === "attribute") {
    if (selectedRow.selectedAttribute?.value) {
      return new AttributeChoicesHandler(client, selectedRow.selectedAttribute.value, inputValue);
    }

    throw new Error("Attribute is not selected, values cannot be fetched");
  }

  if (rowType && isStaticBoolean(rowType)) {
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

  throw new Error(`Unknown filter element: "${rowType}"`);
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
  const fetchAttributeOptions = async (inputValue: string) => {
    const handler = new AttributesHandler(client, inputValue);

    return handler.fetch();
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
