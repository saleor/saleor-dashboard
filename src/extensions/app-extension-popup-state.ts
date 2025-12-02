import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { useAppFrameReferences } from "@dashboard/extensions/popup-frame-reference";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { postToExtension } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/usePostToExtension";
import {
  AllFormPayloads,
  DashboardEventFactory,
  FormPayloadProductEdit,
  FormPayloadProductTranslate,
} from "@saleor/app-sdk/app-bridge";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

type FormState = {
  "product-edit"?: FormPayloadProductEdit;
  "product-translate"?: FormPayloadProductTranslate;
};

type ActiveParams = {
  id: string;
  appToken: string;
  src: string;
  label: string;
  targetName: AppExtensionManifestTarget;
  params?: AppDetailsUrlMountQueryParams;
  formState: FormState;
};

/**
 * @deprecated
 *
 * Separate stateful popup from non-popup extensions
 */
export type AppExtensionActiveParams = ActiveParams;

class ExtensionInactiveState {
  readonly active = false;
}

class ExtensionActiveState {
  readonly active = true;

  id: string;

  appToken: string;

  src: string;

  label: string;

  targetName: AppExtensionManifestTarget;

  params?: AppDetailsUrlMountQueryParams;

  formState: FormState = {};

  constructor(params: ActiveParams) {
    this.id = params.id;
    this.appToken = params.appToken;
    this.src = params.src;
    this.label = params.label;
    this.targetName = params.targetName;
    this.params = params.params;
    this.formState = params.formState;
  }
}

type AppPopupExtensionPossibleStates = ExtensionInactiveState | ExtensionActiveState;

const inactiveState = new ExtensionInactiveState();

const stateAtom = atom<AppPopupExtensionPossibleStates>(inactiveState);

/**
 * TODO: Make this to work also with widget extensions
 */
export const useAppExtensionPopup = () => {
  const [state, setState] = useAtom(stateAtom);
  const { iframes } = useAppFrameReferences();

  useEffect(() => {
    if (state.active) {
      iframes.forEach(({ loaded, target }, iframe) => {
        // This hook only works for popup and assumes there is a singleton instance of popup frame. For Widgets separate logic must be added
        if (target !== "POPUP") {
          return;
        }

        if (loaded) {
          const origin = new URL(state.src).origin;

          // Technically there may be 2 or more forms on the same screen, so we emit each of them
          Object.values(state.formState).forEach(formState => {
            postToExtension(DashboardEventFactory.createFormEvent(formState), iframe, origin);
          });
        }
      });
    }
  }, [state, iframes]);

  return {
    state,
    setActive(params: ActiveParams): void {
      setState(new ExtensionActiveState(params));
    },
    setInactive(): void {
      setState(inactiveState);
    },
    attachFormState(formState: AllFormPayloads): void {
      setState(currentState => {
        if (!currentState.active) {
          throw new Error("You cannot attach form state for closed extension");
        }

        return new ExtensionActiveState({
          id: currentState.id,
          appToken: currentState.appToken,
          src: currentState.src,
          label: currentState.label,
          targetName: currentState.targetName,
          params: currentState.params,
          formState: {
            ...currentState.formState,
            [formState.form]: formState,
          },
        });
      });
    },
  };
};
