export interface State {
  isLoading: boolean;
  isValid: boolean;
}

export type Action =
  | {
      type: "sku/isLoading";
      payload: boolean;
    }
  | {
      type: "sku/isValid";
      payload: boolean;
    };

export const initialState: State = {
  isLoading: false,
  isValid: true,
};

export const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "sku/isLoading":
      return { ...state, isLoading: action.payload };
    case "sku/isValid":
      return { ...state, isValid: action.payload };
    default:
      return state;
  }
};
