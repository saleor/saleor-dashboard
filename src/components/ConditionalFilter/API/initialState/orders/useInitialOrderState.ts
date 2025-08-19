import { useApolloClient } from "@apollo/client";
import { OrderFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatus,
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
    authorizeStatus,
    ids,
    number,
    userEmail,
    voucherCode,
    linesCount,
  }: OrderFetchingParams) => {
    if (channels.length > 0) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
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
    const authorizeStatusInit = new EnumValuesHandler(
      OrderAuthorizeStatusEnum,
      "authorizeStatus",
      intl,
      authorizeStatus,
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
      authorizeStatus: await authorizeStatusInit.fetch(),
      ids: mapIDsToOptions(ids),
      number: mapTextToOptions(number, "number"),
      userEmail: mapTextToOptions(userEmail, "userEmail"),
      voucherCode: mapTextToOptions(voucherCode, "voucherCode"),
      linesCount: mapTextToOptions(linesCount, "linesCount"),
    };

    setData(
      new InitialOrderStateResponse(
        initialState.status,
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
        initialState.number,
        initialState.userEmail,
        initialState.voucherCode,
        initialState.linesCount,
      ),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
}
