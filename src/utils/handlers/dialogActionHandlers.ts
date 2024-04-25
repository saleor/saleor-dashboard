import { UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { BulkAction, Dialog, SingleAction } from "@dashboard/types";

type Url<T extends Dialog<any>> = (params: T) => string;

export type OpenModalFunction<TAction extends string, TParams extends Dialog<TAction>> = (
  action: TAction,
  newParams?: TParams,
) => void;

export type CloseModalFunction = () => void;

type CreateCloseModal<TAction extends string, TParams extends Dialog<TAction>> = [
  OpenModalFunction<TAction, TParams>,
  CloseModalFunction,
];

function createDialogActionHandlers<
  TAction extends string,
  TParams extends Dialog<TAction> & BulkAction & SingleAction,
>(
  navigate: UseNavigatorResult,
  url: Url<TParams>,
  params: TParams,
  fieldsToClear?: Array<keyof TParams>,
): CreateCloseModal<TAction, TParams> {
  const objToClear = fieldsToClear?.reduce((obj, key) => ({ ...obj, [key]: undefined }), {}) ?? {};
  const close = () =>
    navigate(
      url({
        ...params,
        ...objToClear,
        action: undefined,
        id: undefined,
        ids: undefined,
      }),
      { replace: true },
    );
  const open = (action: TAction, newParams?: TParams) =>
    navigate(
      url({
        ...params,
        ...newParams,
        action,
      }),
    );

  return [open, close];
}

export default createDialogActionHandlers;
