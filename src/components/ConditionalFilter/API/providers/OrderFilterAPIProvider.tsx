import { ApolloClient, useApolloClient } from "@apollo/client";
import {
  AttributeInputTypeEnum,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
} from "@dashboard/graphql";
import { IntlShape, useIntl } from "react-intl";

import { RowType } from "../../constants";
import { FilterContainer, FilterElement } from "../../FilterElement";
import { FilterAPIProvider } from "../FilterAPIProvider";
import {
  BooleanValuesHandler,
  EnumValuesHandler,
  Handler,
  LegacyChannelHandler,
  NoopValuesHandler,
  TextInputValuesHandler,
} from "../Handler";
import { getFilterElement } from "../utils";

const isStaticBoolean = (rowType: RowType) => {
  return ["isClickAndCollect", "isPreorder", "giftCardUsed", "giftCardBought"].includes(rowType);
};

const createAPIHandler = (
  selectedRow: FilterElement,
  inputValue: string,
  intl: IntlShape,
  client: ApolloClient<unknown>,
): Handler => {
  const rowType = selectedRow.rowType();

  if (rowType && isStaticBoolean(rowType) && rowType !== "attribute") {
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


  if (rowType === "status") {
    return new EnumValuesHandler(OrderStatus, rowType, intl);
  }

  if (rowType === "authorizeStatus") {
    return new EnumValuesHandler(OrderAuthorizeStatusEnum, rowType, intl);
  }

  if (rowType === "chargeStatus") {
    return new EnumValuesHandler(OrderChargeStatusEnum, rowType, intl);
  }

  if (rowType === "channels") {
    return new LegacyChannelHandler(client, inputValue);
  }

  if (rowType === "customer") {
    return new TextInputValuesHandler([
      {
        label: "Customer",
        value: selectedRow.condition.selected.value as string,
        type: "customer",
        slug: "customer",
      },
    ]);
  }

  if (rowType === "ids") {
    return new NoopValuesHandler([]);
  }

  if (rowType === "metadata") {
    return new NoopValuesHandler([]);
  }

  // Boolean fields
  if (rowType === "isClickAndCollect" || rowType === "isGiftCardBought" || rowType === "isGiftCardUsed" || 
      rowType === "hasInvoices" || rowType === "hasFulfillments") {
    return new BooleanValuesHandler([
      { label: "Yes", value: "true", type: AttributeInputTypeEnum.BOOLEAN, slug: "true" },
      { label: "No", value: "false", type: AttributeInputTypeEnum.BOOLEAN, slug: "false" },
    ]);
  }

  // Price/Amount fields  
  if (rowType === "totalGross" || rowType === "totalNet") {
    return new NoopValuesHandler([]);
  }

  // Date/datetime fields
  if (rowType === "invoicesCreatedAt") {
    return new NoopValuesHandler([]);
  }

  // Text input fields
  if (rowType === "number" || rowType === "userEmail" || rowType === "voucherCode" || rowType === "linesCount") {
    return new NoopValuesHandler([]);
  }

  throw new Error(`Unknown filter element: "${rowType}"`);
};

export const useOrderFilterAPIProvider = (): FilterAPIProvider => {
  const intl = useIntl();
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const handler = createAPIHandler(filterElement, inputValue, intl, client);

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
