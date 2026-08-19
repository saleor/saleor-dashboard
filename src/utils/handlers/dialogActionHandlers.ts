import { isTransientQueryKey } from "@dashboard/components/Form/useExitFormDialogProvider";
import { history } from "@dashboard/components/Router";
import { type UseNavigatorResult } from "@dashboard/hooks/useNavigator";
import { type BulkAction, type Dialog, type SingleAction } from "@dashboard/types";
import { parseQs } from "@dashboard/url-utils";
import { stringifyQs } from "@dashboard/utils/urls";

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

const parseSearch = (search: string): Record<string, unknown> =>
  parseQs(search.startsWith("?") ? search.slice(1) : search) as Record<string, unknown>;

/**
 * Keep the browser's current pathname encoding when the url helper only
 * changes dialog query params. Entity urls use encodeURIComponent(id); GraphQL
 * ids often end in "=" so a rebuilt path (`%3D%3D`) can disagree with the
 * decoded location (`==`) and look like leaving the page to the exit-form guard.
 *
 * Also keep non-dialog query params from the current URL. Rebuilding from
 * `params` can drop them, which the exit-form guard treats as leaving the page
 * (e.g. Delete → `?action=remove` while the form is dirty).
 */
const withCurrentLocationIfSamePage = (generatedUrl: string): string => {
  const queryIndex = generatedUrl.indexOf("?");
  const generatedPath = queryIndex >= 0 ? generatedUrl.slice(0, queryIndex) : generatedUrl;
  const generatedSearch = queryIndex >= 0 ? generatedUrl.slice(queryIndex) : "";
  // List links have historically put `entityUrl(id)` (which ends with `?`) into
  // LocationDescriptor.pathname, so history.pathname can literally contain `?`.
  const currentPath = history.location.pathname.split("?")[0];

  if (normalizePathname(generatedPath) !== normalizePathname(currentPath)) {
    return generatedUrl;
  }

  const currentParsed = parseSearch(history.location.search);
  const generatedParsed = parseSearch(generatedSearch);
  const preserved: Record<string, unknown> = {};

  Object.keys(currentParsed).forEach(key => {
    if (!isTransientQueryKey(key)) {
      preserved[key] = currentParsed[key];
    }
  });

  const merged = stringifyQs({ ...preserved, ...generatedParsed });

  return `${currentPath}${merged ? `?${merged}` : ""}`;
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
      withCurrentLocationIfSamePage(
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
      withCurrentLocationIfSamePage(
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
