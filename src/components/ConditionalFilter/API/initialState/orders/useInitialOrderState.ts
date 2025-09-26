import { useApolloClient } from "@apollo/client";
import { OrderFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  _SearchWarehouseOperandsDocument,
  _SearchWarehouseOperandsQuery,
  _SearchWarehouseOperandsQueryVariables,
  CountryCode,
  FulfillmentStatus,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
  PaymentMethodTypeEnum,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { EnumValuesHandler } from "../../Handler";
import { createInitialOrderState } from "../helpers";
import { InitialOrderAPIResponse } from "../types";
import { InitialOrderStateResponse } from "./InitialOrderState";

const mapIDsToOptions = (ids: string[]) =>
  ids.map(id => ({
    type: "ids",
    label: id,
    value: id,
    slug: id,
  }));

const mapTextToOptions = (values: string[], type: string) =>
  values.map(value => ({
    type,
    label: value,
    value,
    slug: value,
  }));

export interface InitialOrderAPIState {
  data: InitialOrderStateResponse;
  loading: boolean;
  fetchQueries: (params: OrderFetchingParams) => Promise<void>;
}

export const useInitialOrderState = (): InitialOrderAPIState => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialOrderStateResponse>(InitialOrderStateResponse.empty());
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialOrderAPIResponse>> = [];

  const fetchQueries = async ({
    channels,
    chargeStatus,
    status,
    fulfillmentStatus,
    authorizeStatus,
    ids,
    metadata,
    number,
    userEmail,
    voucherCode,
    linesCount,
    checkoutId,
    linesMetadata,
    transactionsMetadata,
    transactionsPaymentType,
    transactionsCardBrand,
    fulfillmentsMetadata,
    billingPhoneNumber,
    billingCountry,
    shippingPhoneNumber,
    shippingCountry,
    fulfillmentWarehouse,
  }: OrderFetchingParams) => {
    if (channels.length > 0) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
        }),
      );
    }

    if (fulfillmentWarehouse.length > 0) {
      queriesToRun.push(
        client.query<_SearchWarehouseOperandsQuery, _SearchWarehouseOperandsQueryVariables>({
          query: _SearchWarehouseOperandsDocument,
          variables: {
            first: fulfillmentWarehouse.length,
            warehouseSlugs: fulfillmentWarehouse,
          },
        }),
      );
    }

    const chargeStatusInit = new EnumValuesHandler(
      OrderChargeStatusEnum,
      "chargeStatus",
      intl,
      chargeStatus,
    );

    const statusInit = new EnumValuesHandler(OrderStatus, "status", intl, status);
    const fulfillmentStatusInit = new EnumValuesHandler(
      FulfillmentStatus,
      "fulfillmentStatus",
      intl,
      fulfillmentStatus,
    );
    const authorizeStatusInit = new EnumValuesHandler(
      OrderAuthorizeStatusEnum,
      "authorizeStatus",
      intl,
      authorizeStatus,
    );

    const transactionsPaymentTypeInit = new EnumValuesHandler(
      PaymentMethodTypeEnum,
      "transactionsPaymentType",
      intl,
      transactionsPaymentType,
    );

    const billingCountryInit = new EnumValuesHandler(
      CountryCode,
      "billingCountry",
      intl,
      billingCountry,
    );

    const shippingCountryInit = new EnumValuesHandler(
      CountryCode,
      "shippingCountry",
      intl,
      shippingCountry,
    );

    const data = await Promise.all(queriesToRun);

    const baseState = createInitialOrderState(data);
    const initialState = {
      isClickAndCollect: baseState.isClickAndCollect,
      isGiftCardBought: baseState.isGiftCardBought,
      isGiftCardUsed: baseState.isGiftCardUsed,
      hasInvoices: baseState.hasInvoices,
      hasFulfillments: baseState.hasFulfillments,
      createdAt: baseState.createdAt,
      updatedAt: baseState.updatedAt,
      invoicesCreatedAt: baseState.invoicesCreatedAt,
      totalGross: baseState.totalGross,
      totalNet: baseState.totalNet,
      user: baseState.user,
      channelId: baseState.channelId,
      chargeStatus: await chargeStatusInit.fetch(),
      status: await statusInit.fetch(),
      fulfillmentStatus: await fulfillmentStatusInit.fetch(),
      authorizeStatus: await authorizeStatusInit.fetch(),
      ids: mapIDsToOptions(ids),
      metadata: metadata,
      number: mapTextToOptions(number, "number"),
      userEmail: mapTextToOptions(userEmail, "userEmail"),
      voucherCode: mapTextToOptions(voucherCode, "voucherCode"),
      linesCount: mapTextToOptions(linesCount, "linesCount"),
      checkoutId: mapTextToOptions(checkoutId, "checkoutId"),
      linesMetadata: linesMetadata,
      transactionsMetadata: transactionsMetadata,
      transactionsPaymentType: await transactionsPaymentTypeInit.fetch(),
      transactionsCardBrand: mapTextToOptions(transactionsCardBrand, "transactionsCardBrand"),
      fulfillmentsMetadata: fulfillmentsMetadata,
      billingPhoneNumber: mapTextToOptions(billingPhoneNumber, "billingPhoneNumber"),
      billingCountry: await billingCountryInit.fetch(),
      shippingPhoneNumber: mapTextToOptions(shippingPhoneNumber, "shippingPhoneNumber"),
      shippingCountry: await shippingCountryInit.fetch(),
      fulfillmentWarehouse: baseState.fulfillmentWarehouse,
    };

    setData(
      new InitialOrderStateResponse(
        initialState.status,
        initialState.fulfillmentStatus,
        initialState.authorizeStatus,
        initialState.chargeStatus,
        initialState.isClickAndCollect,
        initialState.isGiftCardBought,
        initialState.isGiftCardUsed,
        initialState.hasInvoices,
        initialState.hasFulfillments,
        initialState.createdAt,
        initialState.updatedAt,
        initialState.invoicesCreatedAt,
        initialState.totalGross,
        initialState.totalNet,
        initialState.user,
        initialState.channelId,
        initialState.ids,
        initialState.metadata,
        initialState.number,
        initialState.userEmail,
        initialState.voucherCode,
        initialState.linesCount,
        initialState.checkoutId,
        initialState.linesMetadata,
        initialState.transactionsMetadata,
        initialState.transactionsPaymentType,
        initialState.transactionsCardBrand,
        initialState.fulfillmentsMetadata,
        initialState.billingPhoneNumber,
        initialState.billingCountry,
        initialState.shippingPhoneNumber,
        initialState.shippingCountry,
        initialState.fulfillmentWarehouse,
      ),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
