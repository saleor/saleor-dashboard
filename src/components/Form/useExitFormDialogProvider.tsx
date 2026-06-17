// @ts-strict-ignore
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import { type Action, type Location } from "history";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import { type ExitFormDialogData, type FormData, type FormsData } from "./types";

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

  const setSubmitRef = useCallback(
    <T extends () => SubmitPromise<any[]>>(id: symbol, submitFn: T) => {
      setFormData(id, { submitFn });
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

  const isOnlyQuerying = (transition: typeof history.location) =>
    // We need to compare to current path and not window location
    // so it works with browser back button as well
    transition.pathname === currentLocation.current.pathname;

  const shouldBlockNavRef = useRef(shouldBlockNav);
  const setStateDefaultValuesRef = useRef(setStateDefaultValues);

  useEffect(function syncNavigationBlockRefs() {
    shouldBlockNavRef.current = shouldBlockNav;
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

  const continueNavigation = () => {
    setBlockNav(false);
    setDefaultFormsData();
    setCurrentLocation(navAction.current);

    // because our useNavigator navigate action may be blocked
    // by exit dialog we want to avoid using it doing this transition
    if (navAction.current !== null) {
      routerHistory.push(navAction.current.pathname + navAction.current.search);
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
  const providerData: ExitFormDialogData = {
    setIsDirty,
    shouldBlockNavigation,
    showDialog,
    setEnableExitDialog,
    setExitDialogSubmitRef: setSubmitRef,
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
  };
}
