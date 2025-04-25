import { InitialProductTypesStateResponse } from "@dashboard/components/ConditionalFilter/API/initialState/productTypes/InitialProductTypesState";
import { createBooleanOptions } from "@dashboard/components/ConditionalFilter/constants";
import { ProductTypeEnum } from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { ProductTypesFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { EnumValuesHandler } from "../../Handler";

export interface InitialProductTypesAPIState {
  data: InitialProductTypesStateResponse;
  loading: boolean;
  fetchQueries: (params: ProductTypesFetchingParams) => Promise<void>;
}

export const useInitialProductTypesState = (): InitialProductTypesAPIState => {
  const intl = useIntl();
  const [data, setData] = useState<InitialProductTypesStateResponse>(
    InitialProductTypesStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const fetchQueries = async ({ typeOfProduct }: ProductTypesFetchingParams) => {
    const typeOfProductInit = new EnumValuesHandler(
      ProductTypeEnum,
      "typeOfProduct",
      intl,
      typeOfProduct,
    );

    const initialState = {
      typeOfProduct: await typeOfProductInit.fetch(),
      configurable: createBooleanOptions(),
    };

    setData(
      new InitialProductTypesStateResponse(initialState.typeOfProduct, initialState.configurable),
    );
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
