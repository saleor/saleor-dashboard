import { AppDetailsUrlMountQueryParams } from "@dashboard/apps/urls";
import { AppExtensionTargetEnum } from "@dashboard/graphql";
import { createContext, Dispatch, SetStateAction } from "react";

export interface AppData {
  id: string;
  appToken: string;
  src: string;
  label: string;
  target: AppExtensionTargetEnum;
  params?: AppDetailsUrlMountQueryParams;
}

export const ExternalAppContext = createContext<{
  open: boolean;
  appData: AppData | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setAppData: Dispatch<SetStateAction<AppData | undefined>>;
}>({
  open: false,
  appData: undefined,
  setOpen: () => null,
  setAppData: () => null,
});
