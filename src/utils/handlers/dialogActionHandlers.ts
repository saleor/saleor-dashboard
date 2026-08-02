import { history } from "@dashboard/components/Router";
import { type UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { type BulkAction, type Dialog, type SingleAction } from "@dashboard/types";

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

const normalizePathname = (pathname: string): string => {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
};

/**
 * Keep the browser's current pathname encoding when the url helper only
 * changes dialog query params. Entity urls use encodeURIComponent(id); GraphQL
 * ids often end in "=" so a rebuilt path (`%3D%3D`) can disagree with the
 * decoded location (`==`) and look like leaving the page to the exit-form guard.
 */
const withCurrentPathnameIfSamePage = (generatedUrl: string): string => {
  const queryIndex = generatedUrl.indexOf("?");
  const generatedPath = queryIndex >= 0 ? generatedUrl.slice(0, queryIndex) : generatedUrl;
  const search = queryIndex >= 0 ? generatedUrl.slice(queryIndex) : "";
  const currentPath = history.location.pathname;

  if (normalizePathname(generatedPath) === normalizePathname(currentPath)) {
    return `${currentPath}${search}`;
  }

  return generatedUrl;
};

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
      withCurrentPathnameIfSamePage(
        url({
          ...params,
          ...objToClear,
          action: undefined,
          id: undefined,
          ids: undefined,
        }),
      ),
      { replace: true },
    );
  const open = (action: TAction, newParams?: TParams) =>
    navigate(
      withCurrentPathnameIfSamePage(
        url({
          ...params,
          ...newParams,
          action,
        }),
      ),
    );

  return [open, close];
}

export default createDialogActionHandlers;
