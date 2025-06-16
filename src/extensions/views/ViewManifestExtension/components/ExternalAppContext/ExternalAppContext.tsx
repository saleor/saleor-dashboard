import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import React from "react";

import { AppData, ExternalAppContext } from "./context";

export const useExternalApp = () => {
  const { open, setOpen, setAppData } = React.useContext(ExternalAppContext);
  const navigate = useNavigator();
  const openApp = (appData: AppData) => {
    switch (appData.target) {
      case AppExtensionTargetEnum.POPUP:
        setOpen(true);
        setAppData(appData);
        break;

      case AppExtensionTargetEnum.APP_PAGE:
        navigate(ExtensionsUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
          resetScroll: true,
        });
        break;
      case AppExtensionTargetEnum.NEW_TAB:
      case AppExtensionTargetEnum.WIDGET: {
        throw new Error("NEW_TAB and WIDGET targets can be loaded into context");
      }
    }
  };
  const closeApp = () => setOpen(false);

  return { open, openApp, closeApp };
};
