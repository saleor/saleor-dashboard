export interface AppError {
  type: "unhandled";
  id: string | null | undefined;
}

interface IAppState {
  error: AppError | null;
  loading: boolean;
}

export const initialAppState: IAppState = {
  error: null,
  loading: false,
};

export default IAppState;
