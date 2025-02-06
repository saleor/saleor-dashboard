import { useApolloClient } from "@apollo/client";
import { EnumValuesHandler } from "@dashboard/components/ConditionalFilter/API/Handler";
import { createInitialVoucherState } from "@dashboard/components/ConditionalFilter/API/initialState/helpers";
import { InitialVoucherAPIResponse } from "@dashboard/components/ConditionalFilter/API/initialState/types";
import {
  InitialVouchersState,
  InitialVouchersStateResponse,
} from "@dashboard/components/ConditionalFilter/API/initialState/vouchers/InitialVouchersState";
import { VoucherFetchingParams } from "@dashboard/components/ConditionalFilter/ValueProvider/TokenArray/fetchingParams";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  DiscountStatusEnum,
  VoucherDiscountType,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

export interface InitialVoucherAPIState {
  data: InitialVouchersState;
  loading: boolean;
  fetchQueries: (params: VoucherFetchingParams) => Promise<void>;
}

export const useInitialVouchersState = (): InitialVoucherAPIState => {
  const client = useApolloClient();
  const intl = useIntl();
  const [data, setData] = useState<InitialVouchersStateResponse>(
    InitialVouchersStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);
  const queriesToRun: Array<Promise<InitialVoucherAPIResponse>> = [];

  const fetchQueries = async ({ discountType, status, channel }: VoucherFetchingParams) => {
    if (channel) {
      queriesToRun.push(
        client.query<_GetLegacyChannelOperandsQuery, _GetLegacyChannelOperandsQueryVariables>({
          query: _GetLegacyChannelOperandsDocument,
        }),
      );
    }

    const discountTypeInit = new EnumValuesHandler(
      VoucherDiscountType,
      "discountType",
      intl,
      discountType,
    );

    const statusInit = new EnumValuesHandler(DiscountStatusEnum, "status", intl, status);

    const data = await Promise.all(queriesToRun);
    const initialState = {
      ...createInitialVoucherState(data),
      discountType: await discountTypeInit.fetch(),
      status: await statusInit.fetch(),
    };

    setData(
      new InitialVouchersStateResponse(
        initialState.channels,
        initialState.discountType,
        initialState.status,
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
