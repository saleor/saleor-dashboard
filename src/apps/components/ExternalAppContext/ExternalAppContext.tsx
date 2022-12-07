import { appDeepUrl } from "@saleor/apps/urls";
import { AppExtensionTargetEnum } from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { AppDialog } from "../AppDialog";
import { AppFrame } from "../AppFrame";
import { AppData, ExternalAppContext } from "./context";

export const ExternalAppProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [appData, setAppData] = React.useState<AppData | undefined>();

  const handleClose = () => {
    setOpen(false);
    setAppData(undefined);
  };

  return (
    <ExternalAppContext.Provider value={{ open, appData, setOpen, setAppData }}>
      {children}
      <AppDialog open={open} onClose={handleClose} title={appData?.label}>
        {open && appData && (
          <AppFrame
            src={appData.src}
            appToken={appData.appToken}
            appId={appData.id}
            params={appData.params}
          />
        )}
      </AppDialog>
    </ExternalAppContext.Provider>
  );
};

export const useExternalApp = () => {
  const { open, setOpen, setAppData } = React.useContext(ExternalAppContext);
  const navigate = useNavigator();

  const openApp = (appData: AppData) => {
    if (appData.target === AppExtensionTargetEnum.POPUP) {
      setOpen(true);
      setAppData(appData);
    } else {
      navigate(appDeepUrl(appData.id, appData.src, appData.params), {
        resetScroll: true,
      });
    }
  };

  const closeApp = () => setOpen(false);

  return { open, openApp, closeApp };
};
