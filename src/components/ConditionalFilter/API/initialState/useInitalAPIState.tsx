import { FetchingParams } from "../../ValueProvider/TokenArray/fetchingParams";
import { InitialStateResponse } from "../InitialStateResponse";
import { createInitialStateFromData, useDataFromAPI } from "./helpers";

export const useInitialAPIState = (props: FetchingParams) => {
  const { data, loading } = useDataFromAPI({
    ...props,
  });

  const initialState = createInitialStateFromData(data, props.channel);

  return {
    data: new InitialStateResponse(
      initialState.category,
      initialState.attribute,
      initialState.channel,
      initialState.collection,
      initialState.productType,
      initialState.isAvailable,
      initialState.isPublished,
      initialState.isVisibleInListing,
      initialState.hasCategory,
      initialState.giftCard
    ),
    loading,
  };
};
