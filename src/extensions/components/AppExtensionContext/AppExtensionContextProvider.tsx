import { APP_VERSION } from "@dashboard/config";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppDialog } from "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { AllFormPayloadUpdatePayloads } from "@saleor/app-sdk/app-bridge";
import { atom, useAtom } from "jotai";
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

// todo this must go to frame-level, to support widgets too
const extensionFormResponseState = atom<AllFormPayloadUpdatePayloads[]>([]);

// todo test
const extensionFormResponseByFormAtom = atom(
  get => {
    const states = get(extensionFormResponseState);

    return states.reduce<Record<string, AllFormPayloadUpdatePayloads[]>>((acc, state) => {
      const formKey = state.form;

      if (!acc[formKey]) {
        acc[formKey] = [];
      }

      acc[formKey].push(state);

      return acc;
    }, {});
  },
  (get, set, newState: AllFormPayloadUpdatePayloads) => {
    const currentStates = get(extensionFormResponseState);
    // Check if this exact state already exists
    const exists = currentStates.some(
      state => state.form === newState.form && JSON.stringify(state) === JSON.stringify(newState),
    );

    if (!exists) {
      set(extensionFormResponseState, [...currentStates, newState]);
    }
  },
);

// todo extract modal from non-modal
export const useActiveAppExtension = () => {
  const { state, setActive, setInactive, attachFormState } = useAppExtensionPopup();
  const navigate = useNavigator();
  const [extensionResponseFrames, setExtensionResponseState] = useAtom(extensionFormResponseState);
  const [byFormFrames] = useAtom(extensionFormResponseByFormAtom);

  const activate = (appData: AppExtensionActiveParams) => {
    if (appData.target === AppExtensionTargetEnum.POPUP) {
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
    extensionResponseFrames,
    attachFormResponseFrame(response: AllFormPayloadUpdatePayloads) {
      setExtensionResponseState(prev => [...prev, response]);
    },
    byFormFrames,
  };
};
