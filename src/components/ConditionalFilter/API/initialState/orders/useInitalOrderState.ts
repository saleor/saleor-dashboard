import { useApolloClient } from "@apollo/client";
import { createBooleanOptions } from "@dashboard/components/ConditionalFilter/constants";
import { OrderFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  OrderAuthorizeStatusEnum,
  OrderChargeStatusEnum,
  OrderStatusFilter,
  PaymentChargeStatusEnum,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { EnumValuesHandler, LegacyChannelHandler } from "../../Handler";
import { InitialOrderState } from "./InitialOrderState";

export const useInitialOrderState = () => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialOrderState>(InitialOrderState.empty());
  const [loading, setLoading] = useState(true);

  const fetchQueries = async ({
    authorizeStatus,
    channels,
    chargeStatus,
    giftCardUsage,
    paymentStatus,
    status,
    ...props
  }: OrderFetchingParams) => {
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

    // @ts-expect-error - TODO
    const channelsInit = new LegacyChannelHandler(client, channels);

    setData(
      new InitialOrderState(
        await paymentStatusInit.fetch(),
        await statusInit.fetch(),
        await authorizeStatusInit.fetch(),
        await chargeStatusInit.fetch(),
        await channelsInit.fetch(),
        createBooleanOptions(),
        createBooleanOptions(),
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
