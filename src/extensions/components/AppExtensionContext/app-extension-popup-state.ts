import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { atom, useAtom } from "jotai";

type ActiveParams = {
  id: string;
  appToken: string;
  src: string;
  label: string;
  targetName: AppExtensionManifestTarget;
  params?: AppDetailsUrlMountQueryParams;
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

  constructor(params: ActiveParams) {
    this.id = params.id;
    this.appToken = params.appToken;
    this.src = params.src;
    this.label = params.label;
    this.targetName = params.targetName;
    this.params = params.params;
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
  };
};
