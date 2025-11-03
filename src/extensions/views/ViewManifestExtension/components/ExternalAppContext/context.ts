import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { AppDetailsUrlMountQueryParams } from "@dashboard/extensions/urls";
import { createContext } from "react";

export interface AppData {
  id: string;
  appToken: string;
  src: string;
  label: string;
  target: AppExtensionManifestTarget;
  params?: AppDetailsUrlMountQueryParams;
}

export const ExternalAppContext = createContext<{
  open: boolean;
  appData: AppData | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAppData: React.Dispatch<React.SetStateAction<AppData | undefined>>;
}>({
  open: false,
  appData: undefined,
  setOpen: () => null,
  setAppData: () => null,
});
