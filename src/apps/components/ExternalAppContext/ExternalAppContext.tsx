import { AppUrls } from "@dashboard/apps/urls";
import { APP_VERSION } from "@dashboard/config";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { useState, useContext } from "react";

import { AppDialog } from "../AppDialog";
import { AppFrame } from "../AppFrame";
import { AppData, ExternalAppContext } from "./context";

export const ExternalAppProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [appData, setAppData] = useState<AppData | undefined>();
  const shop = useShop();
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
            dashboardVersion={APP_VERSION}
            coreVersion={shop?.version}
          />
        )}
      </AppDialog>
    </ExternalAppContext.Provider>
  );
};

export const useExternalApp = () => {
  const { open, setOpen, setAppData } = useContext(ExternalAppContext);
  const navigate = useNavigator();
  const openApp = (appData: AppData) => {
    if (appData.target === AppExtensionTargetEnum.POPUP) {
      setOpen(true);
      setAppData(appData);
    } else {
      navigate(AppUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
        resetScroll: true,
      });
    }
  };
  const closeApp = () => setOpen(false);

  return { open, openApp, closeApp };
};
