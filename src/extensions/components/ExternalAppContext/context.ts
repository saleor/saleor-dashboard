import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { atom } from "jotai";

export interface AppData {
  id: string;
  appToken: string;
  src: string;
  label: string;
  target: AppExtensionTargetEnum;
  params?: AppDetailsUrlMountQueryParams;
}

export const externalAppOpenAtom = atom<boolean>(false);
export const externalAppDataAtom = atom<AppData | undefined>(undefined);
