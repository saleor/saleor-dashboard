import { APP_VERSION } from "@dashboard/config";
import { useExtensionFormPayloadUpdate } from "@dashboard/extensions/app-extension-form-payload-update";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppDialog } from "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { PropsWithChildren } from "react";

import { AppExtensionActiveParams, useAppExtensionPopup } from "../../app-extension-popup-state";

export const AppExtensionPopupProvider = ({ children }: PropsWithChildren) => {
  const { setInactive, state } = useAppExtensionPopup();

  const shop = useShop();
  const handleClose = () => {
    setInactive();
  };

  return (
    <>
      {children}
      <AppDialog
        open={state.active}
        onClose={handleClose}
        title={(state.active && state?.label) || undefined}
      >
        {state.active && (
          <AppFrame
            target="POPUP"
            src={state.src}
            appToken={state.appToken}
            appId={state.id}
            params={state.params}
            dashboardVersion={APP_VERSION}
            coreVersion={shop?.version}
          />
        )}
      </AppDialog>
    </>
  );
};

// todo extract modal from non-modal
export const useActiveAppExtension = () => {
  const { state, setActive, setInactive, attachFormState } = useAppExtensionPopup();
  const navigate = useNavigator();
  const { framesByFormType, attachFormResponseFrame } = useExtensionFormPayloadUpdate();

  const activate = (appData: AppExtensionActiveParams) => {
    if (appData.targetName === "POPUP") {
      setActive(appData);
    } else {
      navigate(ExtensionsUrls.resolveAppDeepUrl(appData.id, appData.src, appData.params), {
        resetScroll: true,
      });
    }
  };
  const deactivate = setInactive;

  return {
    active: state.active,
    activate,
    deactivate,
    attachFormState,
    attachFormResponseFrame,
    framesByFormType,
  };
};
