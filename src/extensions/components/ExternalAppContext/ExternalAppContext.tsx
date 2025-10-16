import { APP_VERSION } from "@dashboard/config";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppDialog } from "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { useAtom } from "jotai";
import { PropsWithChildren } from "react";

import { AppData, externalAppDataAtom, externalAppOpenAtom } from "./context";

export const ExternalAppProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = useAtom(externalAppOpenAtom);
  const [appData, setAppData] = useAtom(externalAppDataAtom);
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

export const useExternalApp = () => {
  const [open, setOpen] = useAtom(externalAppOpenAtom);
  const [, setAppData] = useAtom(externalAppDataAtom);
  const navigate = useNavigator();
  const openApp = (appData: AppData) => {
    if (appData.target === AppExtensionTargetEnum.POPUP) {
      setOpen(true);
      setAppData(appData);
    } else {
      navigate(ExtensionsUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
        resetScroll: true,
      });
    }
  };
  const closeApp = () => setOpen(false);

  return { open, openApp, closeApp };
};
