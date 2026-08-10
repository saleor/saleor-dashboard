// @ts-strict-ignore
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { parseQs } from "@dashboard/url-utils";
import { stringifyQs } from "@dashboard/utils/urls";
import { type Action, type Location } from "history";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import { type ExitFormDialogData, type FormData, type FormsData } from "./types";

// Query params used solely to drive URL-based dialogs/modals (see
// `createDialogActionHandlers`) or other transient in-page UI (e.g. field focus).
// Toggling these on the same pathname must not trigger the "leave without
// saving" prompt for ordinary page forms — unless a dirty form has opted in
// via `setBlockDialogClose` (URL-driven wizards that own their own dirty state).
const DIALOG_QUERY_PARAMS = ["action", "id", "ids", "channelId"];

// ConditionalFilter (list pages and modal pickers) serializes filter tokens
// under numeric query keys (?0=...&1=...). Filter state is never part of a
// form, so changing it must not trigger the exit prompt either.
const isFilterQueryKey = (key: string): boolean => /^\d+$/.test(key);

const isTransientQueryKey = (key: string): boolean =>
  DIALOG_QUERY_PARAMS.includes(key) || isFilterQueryKey(key);

// Stringifies with keys sorted so two equivalent query objects with different
// key ordering produce the same string and compare equal.
const sortedStringify = (params: Record<string, unknown>): string => {
  const sorted: Record<string, unknown> = {};

  Object.keys(params)
    .sort((a, b) => a.localeCompare(b))
    .forEach(key => {
      sorted[key] = params[key];
    });

  return stringifyQs(sorted);
};

const splitDialogParams = (search: string) => {
  const parsed = parseQs(search.startsWith("?") ? search.slice(1) : search);
  const dialog: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  Object.keys(parsed).forEach(key => {
    if (isTransientQueryKey(key)) {
      dialog[key] = parsed[key];
    } else {
      rest[key] = parsed[key];
    }
  });

  return { dialog: sortedStringify(dialog), rest: sortedStringify(rest) };
};

// Returns true when a transition only opens or closes a URL-driven modal:
// the dialog params change while every other query param stays the same.
// Navigating to an identical or differently-scoped location is not treated
// as a dialog toggle, so the regular exit-prompt logic still applies there.
export const isDialogOnlyQueryChange = (currentSearch: string, nextSearch: string): boolean => {
  const current = splitDialogParams(currentSearch);
  const next = splitDialogParams(nextSearch);

  return current.rest === next.rest && current.dialog !== next.dialog;
};

const defaultValues = {
  isDirty: false,
  showDialog: false,
  blockNav: true,
  navAction: null,
  enableExitDialog: false,
  isSubmitting: false,
  formsData: {},
};

/** @deprecated Use react-hook-form instead */
export function useExitFormDialogProvider() {
  const history = useHistory();
  const { history: routerHistory } = useRouter();
  const [showDialog, setShowDialog] = useState(defaultValues.showDialog);
  const [description, setDescription] = useState<ReactNode | null>(null);
  const isSubmitDisabled = useRef(false);
  const setIsSubmitDisabled = useCallback((status: boolean) => {
    isSubmitDisabled.current = status;
  }, []);
  const isSubmitting = useRef(defaultValues.isSubmitting);
  const formsData = useRef<FormsData>({});
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef<typeof history.location>(defaultValues.navAction);
  const lastBlockedAction = useRef<Action | null>(null);
  const enableExitDialog = useRef(defaultValues.enableExitDialog);
  const currentLocation = useRef(history.location);

  const setEnableExitDialog = useCallback((value: boolean) => {
    // dialog should never be toggled to enabled during form submission
    if (isSubmitting.current) {
      return;
    }

    enableExitDialog.current = value;
  }, []);

  const setIsSubmitting = useCallback(
    (value: boolean) => {
      setEnableExitDialog(!value);
      isSubmitting.current = value;
    },
    [setEnableExitDialog],
  );

  const setFormData = useCallback((id: symbol, newData: Partial<FormData>) => {
    const updatedFormData = { ...formsData.current[id], ...newData };

    formsData.current = {
      ...formsData.current,
      [id]: updatedFormData,
    };
  }, []);

  const getFormsDataValuesArray = useCallback(
    () => Object.getOwnPropertySymbols(formsData.current).map(key => formsData.current[key]),
    [],
  );

  const hasAnyFormsDirty = useCallback(
    () => getFormsDataValuesArray().some(({ isDirty }) => isDirty),
    [getFormsDataValuesArray],
  );

  const hasDirtyFormBlockingDialogClose = useCallback(
    () =>
      getFormsDataValuesArray().some(
        ({ isDirty, blockDialogClose }) => isDirty && blockDialogClose,
      ),
    [getFormsDataValuesArray],
  );

  const setSubmitRef = useCallback(
    <T extends () => SubmitPromise<any[]>>(id: symbol, submitFn: T) => {
      setFormData(id, { submitFn });
    },
    [setFormData],
  );

  const setBlockDialogClose = useCallback(
    (id: symbol, value: boolean) => {
      // Registers the form when a dialog opts in before the first setIsDirty call.
      setFormData(id, { blockDialogClose: value });
    },
    [setFormData],
  );

  const setIsDirty = useCallback(
    (id: symbol, value: boolean) => {
      // in case of race conitions between forms and transitions
      if (!formsData.current[id]) {
        return;
      }

      setFormData(id, { isDirty: value });

      if (value) {
        setEnableExitDialog(true);
      } else if (!hasAnyFormsDirty()) {
        setEnableExitDialog(false);
      }
    },
    [hasAnyFormsDirty, setEnableExitDialog, setFormData],
  );

  const unregisterForm = useCallback(
    (id: symbol) => {
      delete formsData.current[id];

      if (!hasAnyFormsDirty()) {
        setEnableExitDialog(false);
      }
    },
    [hasAnyFormsDirty, setEnableExitDialog],
  );

  const setDefaultFormsData = () => {
    formsData.current = defaultValues.formsData;
  };
  const setCurrentLocation = (newLocation: typeof history.location) => {
    currentLocation.current = newLocation;
  };
  const setBlockNav = (value: boolean) => (blockNav.current = value);
  const setDefaultNavAction = () => {
    navAction.current = defaultValues.navAction;
    lastBlockedAction.current = null;
  };
  const setStateDefaultValues = useCallback(() => {
    setIsSubmitting(defaultValues.isSubmitting);
    setDefaultFormsData();
    setShowDialog(defaultValues.showDialog);
    setBlockNav(defaultValues.blockNav);
    setEnableExitDialog(defaultValues.enableExitDialog);
    setDefaultNavAction();
  }, [setEnableExitDialog, setIsSubmitting]);

  const shouldBlockNav = useCallback(() => {
    if (!enableExitDialog.current || !hasAnyFormsDirty()) {
      return false;
    }

    return blockNav.current;
  }, [hasAnyFormsDirty]);

  const resetFormsState = useCallback(() => {
    setStateDefaultValues();
  }, [setStateDefaultValues]);

  const normalizePathname = (pathname: string) => {
    try {
      return decodeURIComponent(pathname);
    } catch {
      return pathname;
    }
  };

  const isOnlyQuerying = (transition: typeof history.location) =>
    // Compare decoded pathnames: entity URLs use encodeURIComponent(id), and
    // Saleor GraphQL IDs often end in "=". history may keep the current location
    // decoded (`...==`) while the next URL is encoded (`...%3D%3D`). Treating
    // that as a different page wrongly blocks dialog opens on dirty forms and
    // resets exit-form state on clean ones.
    normalizePathname(transition.pathname) === normalizePathname(currentLocation.current.pathname);

  const shouldBlockNavRef = useRef(shouldBlockNav);
  const hasDirtyFormBlockingDialogCloseRef = useRef(hasDirtyFormBlockingDialogClose);
  const setStateDefaultValuesRef = useRef(setStateDefaultValues);

  useEffect(function syncNavigationBlockRefs() {
    shouldBlockNavRef.current = shouldBlockNav;
    hasDirtyFormBlockingDialogCloseRef.current = hasDirtyFormBlockingDialogClose;
    setStateDefaultValuesRef.current = setStateDefaultValues;
  });

  useEffect(
    function syncCurrentLocationWithHistory() {
      currentLocation.current = history.location;
    },
    [history.location],
  );

  const handleNavigationBlock = () => {
    // This callback blocks only navigation between internal dashboard pages
    // https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md#caveats
    const unblock = history.block((transition: Location, action: Action) => {
      // needs to be done before the shouldBlockNav condition
      // so it doesn't trigger setting default values
      if (isOnlyQuerying(transition)) {
        // Opening/closing a URL-driven modal is usually part of editing the page
        // form, not leaving it. Dialogs that own their own dirty state opt into
        // blocking that toggle via `setBlockDialogClose`.
        if (isDialogOnlyQueryChange(currentLocation.current.search, transition.search)) {
          if (shouldBlockNavRef.current() && hasDirtyFormBlockingDialogCloseRef.current()) {
            navAction.current = transition;
            lastBlockedAction.current = action;
            setShowDialog(true);

            return false;
          }

          setCurrentLocation(transition);

          return null;
        }

        // No-op same-path push/replace (e.g. dialog calls onSubmit→close then
        // onClose→close again) are not "leaving" — query already matches.
        // Skip POP: after "keep editing" we re-push the current URL, and a
        // second back can target that duplicate entry with identical search.
        if (action !== "POP" && currentLocation.current.search === transition.search) {
          setCurrentLocation(transition);

          return null;
        }

        if (shouldBlockNavRef.current()) {
          navAction.current = transition;
          lastBlockedAction.current = action;
          setShowDialog(true);

          return false;
        }

        setCurrentLocation(transition);

        // transition type requires this function to return either
        // false | void | string where string opens up the browser prompt
        // hence we return null
        return null;
      }

      if (shouldBlockNavRef.current()) {
        navAction.current = transition;
        lastBlockedAction.current = action;
        setShowDialog(true);

        return false;
      }

      setStateDefaultValuesRef.current();
      setCurrentLocation(transition);

      return null;
    });

    return unblock;
  };

  useEffect(handleNavigationBlock, [history]);

  const clearDirtyDialogCloseForms = () => {
    Object.getOwnPropertySymbols(formsData.current).forEach(id => {
      const form = formsData.current[id];

      if (form?.blockDialogClose) {
        formsData.current[id] = {
          ...form,
          isDirty: false,
          blockDialogClose: false,
        };
      }
    });
  };

  const continueNavigation = () => {
    const next = navAction.current;
    // Closing a URL-driven wizard must not wipe the page form's dirty state —
    // only the dialog that opted into `blockDialogClose` is being abandoned.
    const wasDialogOnlyClose =
      next !== null &&
      normalizePathname(next.pathname) === normalizePathname(currentLocation.current.pathname) &&
      isDialogOnlyQueryChange(currentLocation.current.search, next.search);

    setBlockNav(false);

    if (wasDialogOnlyClose) {
      clearDirtyDialogCloseForms();
      setCurrentLocation(next);
      routerHistory.push(next.pathname + next.search);
      setShowDialog(false);
      setDefaultNavAction();
      setDescription(null);
      blockNav.current = true;
      enableExitDialog.current = hasAnyFormsDirty();

      return;
    }

    setDefaultFormsData();
    setCurrentLocation(next);

    // because our useNavigator navigate action may be blocked
    // by exit dialog we want to avoid using it doing this transition
    if (next !== null) {
      routerHistory.push(next.pathname + next.search);
    }

    setStateDefaultValues();
  };
  const handleLeave = () => {
    continueNavigation();
  };

  const handleClose = () => {
    const wasPopNavigation = lastBlockedAction.current === "POP";

    setDefaultNavAction();
    setShowDialog(false);

    if (hasAnyFormsDirty()) {
      setEnableExitDialog(true);
      setBlockNav(true);

      // Browser back (e.g. Cmd+Left) consumes a POP attempt when history.block
      // returns false. Re-push the current location so the next back gesture
      // goes through history.block again instead of falling through to beforeunload.
      if (wasPopNavigation) {
        const { pathname, search, hash, state } = history.location;

        blockNav.current = false;
        history.push(`${pathname}${search}${hash}`, state);
        blockNav.current = true;
      }
    }
  };
  // Used to prevent race conditions from places such as
  // create pages with navigation on mutation completed
  const shouldBlockNavigation = useCallback(() => !!navAction.current, []);
  const setExitDialogDescription = useCallback((value: ReactNode | null) => {
    setDescription(value);
  }, []);

  const providerData: ExitFormDialogData = {
    setIsDirty,
    shouldBlockNavigation,
    showDialog,
    setEnableExitDialog,
    setExitDialogSubmitRef: setSubmitRef,
    setExitDialogDescription,
    setBlockDialogClose,
    setIsSubmitting,
    setIsSubmitDisabled,
    leave: handleLeave,
    resetFormsState,
    unregisterForm,
  };

  return {
    providerData,
    showDialog,
    handleLeave,
    handleClose,
    shouldBlockNav,
    isSubmitDisabled,
    description,
  };
}
