import { SubmitPromise } from "@saleor/hooks/useForm";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import ExitFormDialog from "./ExitFormDialog";

export interface ExitFormDialogData {
  setIsDirty: (isDirty: boolean) => void;
  setEnableExitDialog: (value: boolean) => void;
  setExitDialogSubmitRef: (
    submitFn: (dataOrEvent?: any) => SubmitPromise<boolean>
  ) => void;
  shouldBlockNavigation: () => boolean;
}

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
  enableExitDialog: false
};

const ExitFormDialogProvider = ({ children }) => {
  const history = useHistory();
  const { history: routerHistory } = useRouter();

  const [showDialog, setShowDialog] = useState(defaultValues.showDialog);

  const submitRef = useRef<() => SubmitPromise<boolean>>(null);
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef(defaultValues.navAction);
  const isDirty = useRef(defaultValues.isDirty);
  const enableExitDialog = useRef(defaultValues.enableExitDialog);

  const setEnableExitDialog = (value: boolean) => {
    enableExitDialog.current = value;
  };

  const setIsDirty = (value: boolean) => {
    isDirty.current = value;

    if (value) {
      enableExitDialog.current = true;
    }
  };

  const setBlockNav = (value: boolean) => (blockNav.current = value);

  const setDefaultNavAction = () =>
    (navAction.current = defaultValues.navAction);

  const setStateDefaultValues = () => {
    setIsDirty(defaultValues.isDirty);
    setShowDialog(defaultValues.showDialog);
    setBlockNav(defaultValues.blockNav);
    setEnableExitDialog(defaultValues.enableExitDialog);
    setSubmitRef(defaultValues.submit);
    setDefaultNavAction();
  };

  const shouldBlockNav = () => {
    if (!enableExitDialog.current || !isDirty.current) {
      return false;
    }

    return blockNav;
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

    return () => {
      unblock();
    };
  };

  useEffect(handleNavigationBlock, []);

  const continueNavigation = () => {
    setBlockNav(false);
    setIsDirty(false);
    // because our useNavigator navigate action may be blocked
    // by exit dialog we want to avoid using it doing this transition
    routerHistory.push(navAction.current.pathname);
    setStateDefaultValues();
  };

  const handleSubmit = async () => {
    if (!submitRef.current) {
      return;
    }

    setShowDialog(false);

    const isError = await submitRef.current();

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

  // Set either on generic form load or on every custom form data change
  // but doesn't cause re-renders
  function setSubmitRef<T extends () => SubmitPromise<boolean>>(submitFn: T) {
    submitRef.current = submitFn;
  }

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
