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

  formState?:
    | AllFormPayloads
    | {
        // todo move to sdk
        form: "edit-product";
        productId: string;
        fields: Record<
          string,
          {
            fieldName: string;
            currentValue: string;
            type: "short-text";
          }
        >;
      };

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

export const useAppExtensionPopup = () => {
  const [state, setState] = useAtom(stateAtom);
  const { iframes } = usePopupFrameReference();

  // todo should send only once
  useEffect(() => {
    console.log("iframe length", iframes.size);

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
    attachFormState(
      formState:
        | AllFormPayloads
        | {
            // todo move to sdk
            form: "edit-product";
            productId: string;
            fields: Record<
              string,
              {
                fieldName: string;
                currentValue: string;
                type: "short-text";
              }
            >;
          },
    ) {
      setState(currentState => {
        if (!currentState.active) {
          throw new Error("You can not attach form state for closed extension");
        }

        currentState.formState = formState;

        return currentState;
      });
    },
  };
};
