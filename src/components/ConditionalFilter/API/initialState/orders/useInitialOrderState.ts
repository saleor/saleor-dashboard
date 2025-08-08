import { useApolloClient } from "@apollo/client";
import { OrderFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
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
    paymentStatus,
    status,
    authorizeStatus,
    ids,
  }: OrderFetchingParams) => {
    if (channels.length > 0) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
        }),
      );
    }

    const paymentStatusInit = new EnumValuesHandler(
      PaymentChargeStatusEnum,
      "paymentStatus",
      intl,
      paymentStatus,
    );

    const statusInit = new EnumValuesHandler(OrderStatusFilter, "status", intl, status);
    const authorizeStatusInit = new EnumValuesHandler(
      OrderAuthorizeStatusEnum,
      "authorizeStatus",
      intl,
      authorizeStatus,
    );
    const chargeStatusInit = new EnumValuesHandler(
      OrderChargeStatusEnum,
      "authorizeStatus",
      intl,
      chargeStatus,
    );

    const data = await Promise.all(queriesToRun);

    const initialState = {
      ...createInitialOrderState(data),
      paymentStatus: await paymentStatusInit.fetch(),
      status: await statusInit.fetch(),
      authorizeStatus: await authorizeStatusInit.fetch(),
      chargeStatus: await chargeStatusInit.fetch(),
      ids: mapIDsToOptions(ids),
    };

    setData(
      new InitialOrderStateResponse(
        initialState.status,
        initialState.authorizeStatus,
        initialState.chargeStatus,
        initialState.channels,
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
        initialState.channels, // channelId (reuse channels for now)
        initialState.ids,
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
