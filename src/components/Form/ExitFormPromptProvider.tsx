import { SubmitPromise } from "@saleor/hooks/useForm";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useRouter from "use-react-router";

import ExitFormPrompt from "./ExitFormPrompt";

export interface ExitFormPromptData {
  setIsDirty: (isDirty: boolean) => void;
  setEnableExitPrompt: (value: boolean) => void;
  setExitPromptSubmitRef: (submitFn: () => SubmitPromise<boolean>) => void;
  shouldBlockNavigation: boolean;
  // submitRef: MutableRefObject<() => SubmitPromise<boolean>>;
  // cleanExitPromptData: () => void;
}

export const ExitFormPromptContext = React.createContext<ExitFormPromptData>({
  setIsDirty: () => undefined,
  setEnableExitPrompt: () => undefined,
  setExitPromptSubmitRef: () => undefined,
  shouldBlockNavigation: false
  // cleanExitPromptData: () => undefined,
  // submitRef: null
});

const defaultValues = {
  isDirty: false,
  showPrompt: false,
  blockNav: true,
  navAction: null,
  submit: null,
  enableExitPrompt: false
};

const ExitFormPromptProvider = ({ children }) => {
  const history = useHistory();
  const { history: routerHistory } = useRouter();

  const [showPrompt, setShowPrompt] = useState(defaultValues.showPrompt);

  const submitRef = useRef<() => SubmitPromise<boolean>>(null);
  const blockNav = useRef(defaultValues.blockNav);
  const navAction = useRef(defaultValues.navAction);
  const isDirty = useRef(defaultValues.isDirty);
  const enableExitPrompt = useRef(defaultValues.enableExitPrompt);

  const setEnableExitPrompt = (value: boolean) => {
    enableExitPrompt.current = value;
  };

  const setIsDirty = (value: boolean) => {
    isDirty.current = value;

    if (value) {
      enableExitPrompt.current = true;
    }
  };

  const setBlockNav = (value: boolean) => (blockNav.current = value);

  const setStateDefaultValues = () => {
    setIsDirty(defaultValues.isDirty);
    setShowPrompt(defaultValues.showPrompt);
    setBlockNav(defaultValues.blockNav);
    setEnableExitPrompt(defaultValues.enableExitPrompt);
    setSubmitRef(defaultValues.submit);
    navAction.current = defaultValues.navAction;
  };

  const shouldBlockNav = () => {
    if (!enableExitPrompt.current || !isDirty.current) {
      return false;
    }

    return blockNav;
  };

  const handleNavigationBlock = () => {
    const unblock = history.block(transition => {
      if (shouldBlockNav()) {
        navAction.current = transition;
        setShowPrompt(true);
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
    // by exit prompt we want to avoid using it doing this transition
    routerHistory.push(navAction.current.pathname);
    setStateDefaultValues();
  };

  const handleSubmit = async () => {
    if (!submitRef.current) {
      return;
    }

    setShowPrompt(false);

    const isError = await submitRef.current();

    if (!isError) {
      continueNavigation();
    }

    navAction.current = defaultValues.navAction;
  };

  const handleLeave = () => {
    continueNavigation();
  };

  const handleClose = () => {
    navAction.current = defaultValues.navAction;
    setShowPrompt(false);
  };

  // Used to prevent race conditions from places such as
  // create pages with navigation on mutation completed
  const shouldBlockNavigation = !!navAction.current;

  function setSubmitRef<T extends () => SubmitPromise<boolean>>(submitFn: T) {
    submitRef.current = submitFn;
  }

  const providerData: ExitFormPromptData = {
    setIsDirty,
    shouldBlockNavigation,
    setEnableExitPrompt,
    setExitPromptSubmitRef: setSubmitRef
  };

  return (
    <ExitFormPromptContext.Provider value={providerData}>
      <ExitFormPrompt
        isOpen={showPrompt}
        onSubmit={handleSubmit}
        onLeave={handleLeave}
        onClose={handleClose}
      />
      {children}
    </ExitFormPromptContext.Provider>
  );
};

export default ExitFormPromptProvider;
