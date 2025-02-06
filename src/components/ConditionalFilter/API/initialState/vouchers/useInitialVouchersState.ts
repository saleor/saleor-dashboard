import { useApolloClient } from "@apollo/client";
import {
  _GetLegacyChannelOperandsDocument,
  _GetLegacyChannelOperandsQuery,
  _GetLegacyChannelOperandsQueryVariables,
  DiscountStatusEnum,
  VoucherDiscountType,
} from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { VoucherFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { EnumValuesHandler } from "../../Handler";
import { createInitialVoucherState } from "../helpers";
import { InitialVoucherAPIResponse } from "../types";
import { InitialVouchersStateResponse } from "./InitialVouchersState";

export interface InitialVoucherAPIState {
  data: InitialVouchersStateResponse;
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

  const fetchQueries = async ({ discountType, voucherStatus, channel }: VoucherFetchingParams) => {
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

    const voucherStatusInit = new EnumValuesHandler(
      DiscountStatusEnum,
      "voucherStatus",
      intl,
      voucherStatus,
    );

    const data = await Promise.all(queriesToRun);
    const initialState = {
      ...createInitialVoucherState(data),
      discountType: await discountTypeInit.fetch(),
      voucherStatus: await voucherStatusInit.fetch(),
    };

    setData(
      new InitialVouchersStateResponse(
        initialState.channels,
        initialState.discountType,
        initialState.voucherStatus,
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
