export type AppError = "unhandled";

interface IAppState {
  error: AppError | null;
  loading: boolean;
}

export const initialAppState: IAppState = {
  error: null,
  loading: false
};

export default IAppState;
