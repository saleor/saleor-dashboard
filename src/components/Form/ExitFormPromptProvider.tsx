import useNavigator from "@saleor/hooks/useNavigator";
import React, { Ref, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

import ExitFormPrompt from "./ExitFormPrompt";

export interface ExitFormPromptData {
  setIsDirty: (isDirty: boolean) => void;
  formRef: Ref<HTMLFormElement>;
}

export const ExitFormPromptContext = React.createContext<ExitFormPromptData>({
  setIsDirty: () => undefined,
  formRef: null
});

const defaultValues = {
  isDirty: false,
  showPrompt: false,
  blockNav: true,
  navAction: null
};

const ExitFormPromptProvider = ({ children }) => {
  const history = useHistory();
  const navigate = useNavigator();
  const formRef = useRef(null);

  const [showPrompt, setShowPrompt] = useState(defaultValues.showPrompt);
  const [blockNav, setBlockNav] = useState(defaultValues.blockNav);

  const navAction = useRef(defaultValues.navAction);
  const isDirty = useRef(defaultValues.isDirty);

  const setIsDirty = (value: boolean) => (isDirty.current = value);

  const setStateDefaultValues = () => {
    setIsDirty(defaultValues.isDirty);
    setShowPrompt(defaultValues.showPrompt);
    setBlockNav(defaultValues.blockNav);
    navAction.current = defaultValues.navAction;
  };

  const shouldBlockNav = () => {
    if (!isDirty.current) {
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
    navigate(navAction.current.pathname);
    setStateDefaultValues();
  };

  const handleSubmit = async () => {
    const { isError } = await formRef.current.submit();

    if (!isError) {
      continueNavigation();
    }
  };

  const handleLeave = () => {
    continueNavigation();
  };

  const handleClose = () => {
    setShowPrompt(false);
  };

  const providerData = {
    setIsDirty,
    formRef
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
