import { InitialCollectionStateResponse } from "./API/initialState/collections/InitialCollectionState";
import { InitialOrderStateResponse } from "./API/initialState/orders/InitialOrderState";
import { InitialStateResponse } from "./API/InitialStateResponse";

export type InitialResponseType =
  | InitialStateResponse
  | InitialOrderStateResponse
  | InitialCollectionStateResponse;
