import { SubmitPromise } from "@saleor/hooks/useForm";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import ExitFormDialog from "./ExitFormDialog";

export interface ExitFormDialogData {
  setIsDirty: (id: symbol, isDirty: boolean) => void;
  setExitDialogSubmitRef: (id: symbol, submitFn: SubmitFn) => void;
  setEnableExitDialog: (value: boolean) => void;
  shouldBlockNavigation: () => boolean;
}

export type SubmitFn = (dataOrEvent?: any) => SubmitPromise<boolean>;

type FormsData = Record<symbol, FormData>;

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
  shouldBlockNavigation: () => false
});

const defaultValues = {
  isDirty: false,
  showDialog: false,
  blockNav: true,
  navAction: null,
  submit: null,
  enableExitDialog: false,
  formsData: {}
};

const ExitFormDialogProvider = ({ children }) => {
  const history = useHistory();
  const { history: routerHistory } = useRouter();

  const [showDialog, setShowDialog] = useState(defaultValues.showDialog);

  const formsData = useRef<FormsData>({});
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef(defaultValues.navAction);
  const enableExitDialog = useRef(defaultValues.enableExitDialog);

  // Set either on generic form load or on every custom form data change
  // but doesn't cause re-renders
  function setSubmitRef<T extends () => SubmitPromise<boolean>>(
    id: symbol,
    submitFn: T
  ) {
    setFormData(id, { submitFn });
  }

  const setEnableExitDialog = (value: boolean) => {
    enableExitDialog.current = value;
  };

  const setDefaultFormsData = () => {
    formsData.current = defaultValues.formsData;
  };

  const setFormData = (id: symbol, newData: Partial<FormData>) => {
    // will spread copy it all properly?
    const updatedFormData = { ...formsData.current[id], ...newData };

    // will spread copy it all properly?
    formsData.current = {
      ...formsData.current,
      [id]: updatedFormData
    };
  };

  const setIsDirty = (id: symbol, value: boolean) => {
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

  const handleNavigationBlock = () => {
    const unblock = history.block(transition => {
      if (shouldBlockNav()) {
        navAction.current = transition;
        setShowDialog(true);
        return false;
      }

      setStateDefaultValues();
      return true;
    });

    return unblock;
  };

  useEffect(handleNavigationBlock, []);

  const continueNavigation = () => {
    setBlockNav(false);
    setDefaultFormsData();
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
    console.log(111, getDirtyFormsSubmitFn());
    if (!hasAnySubmitFn()) {
      return;
    }

    setShowDialog(false);

    const response = await Promise.all(
      getDirtyFormsSubmitFn().map(submitFn => submitFn())
    );

    const isError = response.some(result => !result);

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
    setExitDialogSubmitRef: setSubmitRef
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
