import IAppState, { AppError } from "./state";

export type AppStateReducerActionType = "displayError" | "displayLoader";

export interface AppStateReducerAction {
  payload: Partial<{
    error: AppError["type"];
    errorId: AppError["id"];
    value: boolean;
  }>;
  type: AppStateReducerActionType;
}

function displayError(
  prevState: IAppState,
  errorType: AppError["type"],
  errorId?: AppError["id"],
): IAppState {
  return {
    ...prevState,
    error: {
      id: errorId,
      type: errorType,
    },
    loading: false,
  };
}

function displayLoader(prevState: IAppState, value: boolean): IAppState {
  return {
    ...prevState,
    loading: value,
  };
}

function reduceAppState(
  prevState: IAppState,
  action: AppStateReducerAction,
): IAppState {
  switch (action.type) {
    case "displayError":
      return displayError(
        prevState,
        action.payload.error,
        action.payload.errorId,
      );
    case "displayLoader":
      return displayLoader(prevState, action.payload.value);
    default:
      return prevState;
  }
}

export default reduceAppState;
