import { usePopupFrameReference } from "@dashboard/extensions/popup-frame-reference";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { postToExtension } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/usePostToExtension";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { AllFormPayloads, DashboardEventFactory } from "@saleor/app-sdk/app-bridge";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

type ActiveParams = {
  id: string;
  appToken: string;
  src: string;
  label: string;
  target: AppExtensionTargetEnum;
  params?: AppDetailsUrlMountQueryParams;
  formState?: AllFormPayloads;
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

  target: AppExtensionTargetEnum;

  params?: AppDetailsUrlMountQueryParams;

  formState?: AllFormPayloads;

  constructor(params: ActiveParams) {
    this.id = params.id;
    this.appToken = params.appToken;
    this.src = params.src;
    this.label = params.label;
    this.target = params.target;
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
  const { iframes } = usePopupFrameReference();

  useEffect(() => {
    if (state.active) {
      iframes.entries().forEach(([iframe, { loaded }]) => {
        if (loaded) {
          const origin = new URL(state.src).origin;

          postToExtension(DashboardEventFactory.createFormEvent(state.formState!), iframe, origin);
        }
      });
    }
  }, [state.active, iframes]);

  return {
    state,
    setActive(params: ActiveParams) {
      setState(new ExtensionActiveState(params));
    },
    setInactive() {
      setState(inactiveState);
    },
    attachFormState(formState: AllFormPayloads) {
      setState(currentState => {
        if (!currentState.active) {
          throw new Error("You cannot attach form state for closed extension");
        }

        return new ExtensionActiveState({
          id: currentState.id,
          appToken: currentState.appToken,
          src: currentState.src,
          label: currentState.label,
          target: currentState.target,
          params: currentState.params,
          formState,
        });
      });
    },
  };
};
