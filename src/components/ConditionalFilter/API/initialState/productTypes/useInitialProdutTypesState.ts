import { InitialProductTypesStateResponse } from "@dashboard/components/ConditionalFilter/API/initialState/productTypes/InitialProductTypesState";
import { ProductTypeConfigurable, ProductTypeEnum } from "@dashboard/graphql";
import { useState } from "react";
import { useIntl } from "react-intl";

import { ProductTypesFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";
import { BooleanValuesHandler, EnumValuesHandler } from "../../Handler";

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

    const configurableInit = new BooleanValuesHandler([
      {
        label: "Yes",
        value: ProductTypeConfigurable.CONFIGURABLE,
        type: "configurable",
        slug: "true",
      },
      {
        label: "No",
        value: ProductTypeConfigurable.SIMPLE,
        type: "configurable",
        slug: "false",
      },
    ]);

    const initialState = {
      typeOfProduct: await typeOfProductInit.fetch(),
      configurable: await configurableInit.fetch(),
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
