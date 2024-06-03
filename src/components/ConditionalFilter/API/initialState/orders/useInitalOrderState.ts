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

const getCustomer = (customer: string[]) => {
  if (Array.isArray(customer) && customer.length > 0) {
    return customer.at(-1) ?? "";
  }

  return "";
};

export interface InitialOrderAPIState {
  data: InitialOrderStateResponse;
  loading: boolean;
  fetchQueries?: (params: OrderFetchingParams) => Promise<void>;
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
    customer,
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
      customer: [
        {
          type: "customer",
          label: "Customer",
          value: getCustomer(customer),
          slug: "customer",
        },
      ],
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
        initialState.giftCardBought,
        initialState.giftCardUsed,
        initialState.customer,
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
