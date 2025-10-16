import { APP_VERSION } from "@dashboard/config";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppDialog } from "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { useAtom } from "jotai";
import { PropsWithChildren } from "react";

import { ActiveAppExtensionContextData, ActiveAppExtensionContextState } from "./context";

export const AppExtensionPopupProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useAtom(ActiveAppExtensionContextState.open);
  const [appData, setAppData] = useAtom(ActiveAppExtensionContextState.data);
  const shop = useShop();
  const handleClose = () => {
    setOpen(false);
    setAppData(undefined);
  };

  return (
    <>
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
    </>
  );
};

export const useActiveAppExtension = () => {
  const [open, setOpen] = useAtom(ActiveAppExtensionContextState.open);
  const [, setAppData] = useAtom(ActiveAppExtensionContextState.data);
  const navigate = useNavigator();

  const activate = (appData: ActiveAppExtensionContextData) => {
    if (appData.target === AppExtensionTargetEnum.POPUP) {
      setOpen(true);
      setAppData(appData);
    } else {
      navigate(ExtensionsUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
        resetScroll: true,
      });
    }
  };
  const deactivate = () => setOpen(false);

  return { active: open, activate, deactivate };
};
