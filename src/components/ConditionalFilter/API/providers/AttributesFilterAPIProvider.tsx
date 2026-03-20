import { type ApolloClient, useApolloClient } from "@apollo/client";
import { AttributeTypeEnum } from "@dashboard/graphql";
import { type IntlShape, useIntl } from "react-intl";

import { type FilterContainer, type FilterElement } from "../../FilterElement";
import { type FilterAPIProvider } from "../FilterAPIProvider";
import { BooleanValuesHandler, ChannelHandler, EnumValuesHandler, type Handler } from "../Handler";

const getFilterElement = (value: FilterContainer, index: number): FilterElement => {
  const possibleFilterElement = value[index];

  if (typeof possibleFilterElement !== "string" && !Array.isArray(possibleFilterElement)) {
    return possibleFilterElement;
  }

  throw new Error("Unknown filter element used to create API handler");
};

const booleanTypes = [
  "isVariantOnly",
  "valueRequired",
  "visibleInStorefront",
  "filterableInStorefront",
];

const createAPIHandler = (
  selectedRow: FilterElement,
  client: ApolloClient<unknown>,
  inputValue: string,
  intl: IntlShape,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType === "channel") {
    return new ChannelHandler(client, inputValue);
  }

  if (rowType === "attributeType") {
    return new EnumValuesHandler(AttributeTypeEnum, "attributeType", intl);
  }

  if (rowType && booleanTypes.includes(rowType) && rowType !== "attribute") {
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

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useAttributesFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, client, inputValue, intl);

    return handler.fetch();
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
