import { APP_VERSION } from "@dashboard/config";
import { useExtensionFormPayloadUpdate } from "@dashboard/extensions/app-extension-form-payload-update";
import { useRegisteredExtensions } from "@dashboard/extensions/extension-registry";
import { isTokenFresh } from "@dashboard/extensions/isTokenFresh";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { findOpenPopupExtension, validateOpenPopupParams } from "@dashboard/extensions/open-popup";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppDialog } from "@dashboard/extensions/views/ViewManifestExtension/components/AppDialog/AppDialog";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import useNavigator from "@dashboard/hooks/useNavigator";
import useShop from "@dashboard/hooks/useShop";
import { type PropsWithChildren } from "react";

import {
  type AppExtensionActiveParams,
  useAppExtensionPopup,
} from "../../app-extension-popup-state";

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

export interface OpenPopupByIdentifierResult {
  ok: boolean;
  /** Failure description, set when `ok` is false. */
  reason?: string;
}

// todo extract modal from non-modal
export const useActiveAppExtension = () => {
  const { state, setActive, setInactive, attachFormState } = useAppExtensionPopup();
  const navigate = useNavigator();
  const { framesByFormType, attachFormResponseFrame } = useExtensionFormPayloadUpdate();
  const registeredExtensions = useRegisteredExtensions();

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

  /**
   * Resolve and open a POPUP extension by its `identifier`, scoped to the
   * requesting app and the extensions loaded on the current page. Used by the
   * `openPopup` App Bridge action so a widget can open its "full mode" popup.
   */
  const openPopupByIdentifier = ({
    requestingAppId,
    extensionIdentifier,
    appParams,
  }: {
    requestingAppId: string;
    extensionIdentifier: string;
    appParams?: string;
  }): OpenPopupByIdentifierResult => {
    const extension = findOpenPopupExtension(registeredExtensions, {
      requestingAppId,
      extensionIdentifier,
    });

    if (!extension) {
      return {
        ok: false,
        reason: `No POPUP extension with identifier "${extensionIdentifier}" found for the requesting app on this page`,
      };
    }

    const absoluteUrl = isUrlAbsolute(extension.url)
      ? extension.url
      : `${extension.app.appUrl ?? ""}${extension.url}`;

    if (!isUrlAbsolute(absoluteUrl)) {
      return {
        ok: false,
        reason: `Extension "${extensionIdentifier}" has no resolvable absolute URL`,
      };
    }

    const validation = validateOpenPopupParams(appParams);

    if (!validation.ok) {
      return { ok: false, reason: validation.reason };
    }

    // The popup handshake requires a valid JWT - never open with an empty token
    // (e.g. extensions still painting from cache before the network response).
    if (!extension.accessToken) {
      return {
        ok: false,
        reason: `Extension "${extensionIdentifier}" has no access token yet`,
      };
    }

    // On a long-open dashboard the JWT can expire before the widget's refresh
    // timer fires (e.g. after the machine wakes from sleep). Never open a popup
    // with a stale token - kick a refetch and reject so the retry gets a fresh
    // one (the widget's own refresh loop also keeps this list current).
    if (!isTokenFresh(extension.accessToken)) {
      extension.refetch?.();

      return {
        ok: false,
        reason: `Extension "${extensionIdentifier}" access token is stale; refreshing, retry shortly`,
      };
    }

    setActive({
      id: extension.app.id,
      appToken: extension.accessToken,
      src: absoluteUrl,
      label: extension.label,
      targetName: "POPUP",
      // Forward the app's already-serialized payload verbatim.
      params: appParams === undefined ? {} : { appParams },
      formState: {},
    });

    return { ok: true };
  };

  return {
    active: state.active,
    activate,
    deactivate,
    openPopupByIdentifier,
    attachFormState,
    attachFormResponseFrame,
    framesByFormType,
  };
};
