import { SubmitPromise } from "@saleor/hooks/useForm";
import flatten from "lodash-es/flatten";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import ExitFormDialog from "./ExitFormDialog";

export interface ExitFormDialogData {
  setIsDirty: (id: symbol, isDirty: boolean) => void;
  setExitDialogSubmitRef: (id: symbol, submitFn: SubmitFn) => void;
  setEnableExitDialog: (value: boolean) => void;
  shouldBlockNavigation: () => boolean;
  setIsSubmitting: (value: boolean) => void;
}

export type SubmitFn = (dataOrEvent?: any) => SubmitPromise<any[]>;

export type FormId = symbol;

type FormsData = Record<FormId, FormData>;

export interface WithFormId {
  formId: FormId;
}

interface FormData {
  isDirty: boolean;
  submitFn: SubmitFn | null;
}

// Do not use this context directly in components
// use useExitFormDialog hook instead
export const ExitFormDialogContext = React.createContext<ExitFormDialogData>({
  setIsDirty: () => undefined,
  setEnableExitDialog: () => undefined,
  setExitDialogSubmitRef: () => undefined,
  shouldBlockNavigation: () => false,
  setIsSubmitting: () => undefined
});

const defaultValues = {
  isDirty: false,
  showDialog: false,
  blockNav: true,
  navAction: null,
  submit: null,
  enableExitDialog: false,
  isSubmitting: false,
  formsData: {}
};

const ExitFormDialogProvider = ({ children }) => {
  const history = useHistory();
  const { history: routerHistory } = useRouter();

  const [showDialog, setShowDialog] = useState(defaultValues.showDialog);

  const isSubmitting = useRef(defaultValues.isSubmitting);
  const formsData = useRef<FormsData>({});
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef(defaultValues.navAction);
  const enableExitDialog = useRef(defaultValues.enableExitDialog);
  const currentPath = useRef(window.location.pathname);

  // Set either on generic form load or on every custom form data change
  // but doesn't cause re-renders
  function setSubmitRef<T extends () => SubmitPromise<any[]>>(
    id: symbol,
    submitFn: T
  ) {
    setFormData(id, { submitFn });
  }

  const setIsSubmitting = (value: boolean) => {
    setEnableExitDialog(!value);
    isSubmitting.current = value;
  };

  const setEnableExitDialog = (value: boolean) => {
    if (isSubmitting.current) {
      return;
    }

    enableExitDialog.current = value;
  };

  const setDefaultFormsData = () => {
    formsData.current = defaultValues.formsData;
  };

  const setCurrentPath = (newPath: string) => {
    currentPath.current = newPath;
  };

  const setFormData = (id: symbol, newData: Partial<FormData>) => {
    const updatedFormData = { ...formsData.current[id], ...newData };

    formsData.current = {
      ...formsData.current,
      [id]: updatedFormData
    };
  };

  const setIsDirty = (id: symbol, value: boolean) => {
    // in case of race conitions between forms and transitions
    if (!formsData.current[id]) {
      return;
    }

    setFormData(id, { isDirty: value });

    if (value) {
      enableExitDialog.current = true;
    }
  };

  const setBlockNav = (value: boolean) => (blockNav.current = value);

  const setDefaultNavAction = () =>
    (navAction.current = defaultValues.navAction);

  const setStateDefaultValues = () => {
    setDefaultFormsData();
    setShowDialog(defaultValues.showDialog);
    setBlockNav(defaultValues.blockNav);
    setEnableExitDialog(defaultValues.enableExitDialog);
    setDefaultNavAction();
  };

  const getFormsDataValuesArray = () =>
    Object.getOwnPropertySymbols(formsData.current).map(
      key => formsData.current[key]
    );

  const hasAnyFormsDirty = () =>
    getFormsDataValuesArray().some(({ isDirty }) => isDirty);

  const shouldBlockNav = () => {
    if (!enableExitDialog.current || !hasAnyFormsDirty()) {
      return false;
    }

    return blockNav.current;
  };

  const isOnlyQuerying = transition =>
    // wee need to compare to current path and not window location
    // so it works with browser back button as well
    transition.pathname === currentPath.current;

  const handleNavigationBlock = () => {
    const unblock = history.block(transition => {
      // needs to be done before the shouldBlockNav condition
      // so it doesnt trigger setting default values
      if (isOnlyQuerying(transition)) {
        return true;
      }

      if (shouldBlockNav()) {
        navAction.current = transition;
        setShowDialog(true);
        return false;
      }

      setStateDefaultValues();
      setCurrentPath(transition.pathname);
      return true;
    });

    return unblock;
  };

  useEffect(handleNavigationBlock, []);

  const continueNavigation = () => {
    setBlockNav(false);
    setDefaultFormsData();

    setCurrentPath(navAction.current.pathname);
    // because our useNavigator navigate action may be blocked
    // by exit dialog we want to avoid using it doing this transition
    routerHistory.push(navAction.current.pathname);
    setStateDefaultValues();
  };

  const getDirtyFormsSubmitFn = () =>
    getFormsDataValuesArray()
      .filter(({ isDirty }) => isDirty)
      .map(({ submitFn }) => submitFn);

  const hasAnySubmitFn = () =>
    getFormsDataValuesArray().some(({ submitFn }) => !!submitFn);

  const handleSubmit = async () => {
    if (!hasAnySubmitFn()) {
      return;
    }

    setShowDialog(false);
    setIsSubmitting(true);

    const errors = await Promise.all(
      getDirtyFormsSubmitFn().map(submitFn => submitFn())
    );

    const isError = flatten(errors).some(errors => errors);

    setIsSubmitting(false);

    if (!isError) {
      continueNavigation();
    }

    setDefaultNavAction();
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
    setIsSubmitting
  };

  return (
    <ExitFormDialogContext.Provider value={providerData}>
      <ExitFormDialog
        isOpen={showDialog}
        onSubmit={handleSubmit}
        onLeave={handleLeave}
        onClose={handleClose}
      />
      {children}
    </ExitFormDialogContext.Provider>
  );
};

export default ExitFormDialogProvider;
