import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { atom } from "jotai";

class ExtensionInactiveState {
  open = false;
}

class ExtensionActiveState {
  open = true;

  constructor(params: {
    id: string;
    appToken: string;
    src: string;
    label: string;
    target: AppExtensionTargetEnum;
    params?: AppDetailsUrlMountQueryParams;
  }) {}
}

/**
 * todo: refactor. Make it single store. It's either closed - no data - or open - with data
 */
export interface ActiveAppExtensionContextData {
  id: string;
  appToken: string;
  src: string;
  label: string;
  target: AppExtensionTargetEnum;
  params?: AppDetailsUrlMountQueryParams;
}

const openAtom = atom<boolean>(false);
const dataAtom = atom<ActiveAppExtensionContextData | null>(null);

export const ActiveAppExtensionContextState = {
  open: openAtom,
  data: dataAtom,
};
