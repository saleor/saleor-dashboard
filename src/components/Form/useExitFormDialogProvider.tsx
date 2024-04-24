// @ts-strict-ignore
import { SubmitPromise } from "@dashboard/hooks/useForm";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ExitFormDialogData, FormData, FormsData } from "./types";

const defaultValues = {
  isDirty: false,
  showDialog: false,
  blockNav: true,
  navAction: null,
  enableExitDialog: false,
  isSubmitting: false,
  formsData: {},
};

export function useExitFormDialogProvider() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showDialog, setShowDialog] = useState(defaultValues.showDialog);
  const isSubmitDisabled = useRef(false);

  const setIsSubmitDisabled = (status: boolean) => {
    isSubmitDisabled.current = status;
  };

  const isSubmitting = useRef(defaultValues.isSubmitting);
  const formsData = useRef<FormsData>({});
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef<typeof location>(defaultValues.navAction);
  const enableExitDialog = useRef(defaultValues.enableExitDialog);
  const currentLocation = useRef(location);

  const setIsSubmitting = (value: boolean) => {
    setEnableExitDialog(!value);
    isSubmitting.current = value;
  };

  const setEnableExitDialog = (value: boolean) => {
    // dialog should never be toggled to enabled during form submission
    if (isSubmitting.current) {
      return;
    }

    enableExitDialog.current = value;
  };

  const setDefaultFormsData = () => {
    formsData.current = defaultValues.formsData;
  };

  const setCurrentLocation = (newLocation: typeof location) => {
    currentLocation.current = newLocation;
  };

  const setFormData = (id: symbol, newData: Partial<FormData>) => {
    const updatedFormData = { ...formsData.current[id], ...newData };

    formsData.current = {
      ...formsData.current,
      [id]: updatedFormData,
    };
  };

  // Set either on generic form load or on every custom form data change
  // but doesn't cause re-renders
  const setSubmitRef = <T extends () => SubmitPromise<any[]>>(
    id: symbol,
    submitFn: T,
  ) => {
    setFormData(id, { submitFn });
  };

  const setIsDirty = (id: symbol, value: boolean) => {
    // in case of race conitions between forms and transitions
    if (!formsData.current[id]) {
      return;
    }

    setFormData(id, { isDirty: value });

    if (value) {
      setEnableExitDialog(true);
    }
  };

  const setBlockNav = (value: boolean) => (blockNav.current = value);

  const setDefaultNavAction = () =>
    (navAction.current = defaultValues.navAction);

  const setStateDefaultValues = () => {
    setIsSubmitting(defaultValues.isSubmitting);
    setDefaultFormsData();
    setShowDialog(defaultValues.showDialog);
    setBlockNav(defaultValues.blockNav);
    setEnableExitDialog(defaultValues.enableExitDialog);
    setDefaultNavAction();
  };

  const getFormsDataValuesArray = () =>
    Object.getOwnPropertySymbols(formsData.current).map(
      key => formsData.current[key],
    );

  const hasAnyFormsDirty = () =>
    getFormsDataValuesArray().some(({ isDirty }) => isDirty);

  const shouldBlockNav = () => {
    if (!enableExitDialog.current || !hasAnyFormsDirty()) {
      return false;
    }

    return blockNav.current;
  };

  const isOnlyQuerying = (transition: typeof location) =>
    // We need to compare to current path and not window location
    // so it works with browser back button as well
    transition.pathname === currentLocation.current.pathname;

  const handleNavigationBlock = () => {
    // This callback blocks only navigation between internal dashboard pages
    // https://github.com/remix-run/history/blob/main/docs/blocking-transitions.md#caveats

    // TODO: `usePrompt` - https://gist.github.com/rmorse/426ffcc579922a82749934826fa9f743
    // const unblock = navigate.block(transition => {
    //   // needs to be done before the shouldBlockNav condition
    //   // so it doesn't trigger setting default values
    //   if (isOnlyQuerying(transition)) {
    //     // transition type requires this function to return either
    //     // false | void | string where string opens up the browser prompt
    //     // hence we return null
    //     return null;
    //   }
    //   if (shouldBlockNav()) {
    //     navAction.current = transition;
    //     setShowDialog(true);
    //     return false;
    //   }

    //   setStateDefaultValues();
    //   setCurrentLocation(transition);
    //   return null;
    // });

    return () => undefined;
  };

  useEffect(handleNavigationBlock, []);

  const continueNavigation = () => {
    setBlockNav(false);
    setDefaultFormsData();

    setCurrentLocation(navAction.current);
    // because our useNavigator navigate action may be blocked
    // by exit dialog we want to avoid using it doing this transition
    if (navAction.current !== null) {
      navigate(navAction.current.pathname + navAction.current.search);
    }
    setStateDefaultValues();
  };

  const handleLeave = () => {
    continueNavigation();
  };

  const handleClose = () => {
    setDefaultNavAction();
    setShowDialog(false);
  };

  // Used to prevent race conditions from places such as
  // create pages with navigation on mutation completed
  const shouldBlockNavigation = () => !!navAction.current;

  const providerData: ExitFormDialogData = {
    setIsDirty,
    shouldBlockNavigation,
    setEnableExitDialog,
    setExitDialogSubmitRef: setSubmitRef,
    setIsSubmitting,
    setIsSubmitDisabled,
    leave: handleLeave,
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
