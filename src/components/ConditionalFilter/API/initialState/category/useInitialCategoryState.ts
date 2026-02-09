import { InitialCategoryStateResponse } from "./InitialCategoryState";
import { useState } from "react";

import { CategoryFetchingParams } from "../../../ValueProvider/TokenArray/fetchingParams";

export interface InitialCategoryAPIState {
  data: InitialCategoryStateResponse;
  loading: boolean;
  fetchQueries: (params: CategoryFetchingParams) => Promise<void>;
}

export const useInitialCategoryState = (): InitialCategoryAPIState => {
  const [data, setData] = useState<InitialCategoryStateResponse>(
    InitialCategoryStateResponse.empty(),
  );
  const [loading, setLoading] = useState(true);

  const fetchQueries = async (_params: CategoryFetchingParams) => {
    // Categories don't need dynamic initial state
    // Metadata and updatedAt are user-input fields
    setData(InitialCategoryStateResponse.empty());
    setLoading(false);
  };

  return {
    data,
    loading,
    fetchQueries,
  };
};
