import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { AllFormPayloads } from "@saleor/app-sdk/app-bridge";
import { atom, useAtom } from "jotai";

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

export const useAppExtensionPopup = () => {
  const [state, setState] = useAtom(stateAtom);

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
          throw new Error("You can not attach form state for closed extension");
        }

        currentState.formState = formState;

        return currentState;
      });
    },
  };
};
