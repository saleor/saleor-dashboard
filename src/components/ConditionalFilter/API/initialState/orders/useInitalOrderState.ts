import { useApolloClient } from "@apollo/client";
import { createBooleanOptions } from "@dashboard/components/ConditionalFilter/constants";
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

export const useInitialOrderState = () => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialOrderStateResponse>(InitialOrderStateResponse.empty());
  const [loading, setLoading] = useState(true);

  const queriesToRun: Array<Promise<InitialOrderAPIResponse>> = [];

  const fetchQueries = async ({
    channels,
    chargeStatus,
    giftCardUsage,
    paymentStatus,
    status,
    authorizeStatus,
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
      giftCardUsage: [],
    };

    setData(
      new InitialOrderStateResponse(
        initialState.paymentStatus,
        initialState.status,
        initialState.authorizeStatus,
        initialState.chargeStatus,
        initialState.channels,
        initialState.isPreorder,
        initialState.isClickAndCollect,
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
