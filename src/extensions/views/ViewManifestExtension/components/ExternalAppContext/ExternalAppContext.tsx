import { ExtensionsUrls } from "@dashboard/extensions/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useContext } from "react";

import { AppData, ExternalAppContext } from "./context";

export const useExternalApp = () => {
  const { open, setOpen, setAppData } = useContext(ExternalAppContext);
  const navigate = useNavigator();
  const openApp = (appData: AppData) => {
    switch (appData.target) {
      case "POPUP":
        setOpen(true);
        setAppData(appData);
        break;

      case "APP_PAGE":
        navigate(ExtensionsUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
          resetScroll: true,
        });
        break;
      case "NEW_TAB":
      case "WIDGET": {
        throw new Error("NEW_TAB and WIDGET targets can be loaded into context");
      }
    }
  };
  const closeApp = () => setOpen(false);

  return { open, openApp, closeApp };
};
