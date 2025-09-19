import { ApolloClient, useApolloClient } from "@apollo/client";
import {
  CountryCode,
  FulfillmentStatus,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
  PaymentMethodTypeEnum,
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
  WarehouseHandler,
} from "../Handler";
import { getFilterElement } from "../utils";

const isStaticBoolean = (rowType: RowType) => {
  return [
    "isClickAndCollect",
    "isGiftCardBought",
    "isGiftCardUsed",
    "hasInvoices",
    "isPreorder",
    "giftCardUsed",
    "hasFulfillments",
  ].includes(rowType);
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

  if (rowType === "fulfillmentStatus") {
    return new EnumValuesHandler(FulfillmentStatus, rowType, intl);
  }

  if (rowType === "channels") {
    return new LegacyChannelHandler(client, inputValue);
  }

  if (rowType === "fulfillmentWarehouse") {
    return new WarehouseHandler(client, inputValue);
  }

  if (rowType === "customer") {
    return new TextInputValuesHandler([
      {
        label: "Customer ID",
        value: selectedRow.condition.selected.value as string,
        type: "customer",
        slug: "customer",
      },
    ]);
  }

  if (rowType === "ids") {
    return new NoopValuesHandler([]);
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
  if (
    rowType === "number" ||
    rowType === "userEmail" ||
    rowType === "voucherCode" ||
    rowType === "linesCount" ||
    rowType === "checkoutId" ||
    rowType === "billingPhoneNumber" ||
    rowType === "shippingPhoneNumber" ||
    rowType === "transactionsCardBrand"
  ) {
    return new NoopValuesHandler([]);
  }

  // Metadata fields
  if (
    rowType === "linesMetadata" ||
    rowType === "transactionsMetadata" ||
    rowType === "fulfillmentsMetadata" ||
    rowType === "metadata"
  ) {
    return new NoopValuesHandler([]);
  }

  // Payment type enum field
  if (rowType === "transactionsPaymentType") {
    return new EnumValuesHandler(PaymentMethodTypeEnum, rowType, intl);
  }

  // Country enum fields
  if (rowType === "billingCountry" || rowType === "shippingCountry") {
    return new EnumValuesHandler(CountryCode, rowType, intl);
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
