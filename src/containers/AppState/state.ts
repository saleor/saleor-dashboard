export type AppError = "unhandled" | "not-found";

interface IAppState {
  error: AppError | null;
  loading: boolean;
}

export const initialAppState: IAppState = {
  error: null,
  loading: false
};

export default IAppState;
