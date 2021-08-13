import { AppFragment } from "@saleor/fragments/types/AppFragment";
import {
  AppExtensionTargetEnum,
  AppExtensionTypeEnum,
  AppExtensionViewEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { AppData, useExternalApp } from "./components/ExternalAppContext";
import { useExtensionList } from "./queries";

interface AppExtension {
  label: string;
  url: string;
  view: AppExtensionViewEnum;
  type: AppExtensionTypeEnum;
  target: AppExtensionTargetEnum;
  id: string;
  app: AppFragment;
  canBeUsedByUser?: boolean;
}

interface Extension {
  app: AppFragment;
  label: string;
  url: string;
  open(): void;
}
type Target = "create" | "moreActions";

const filterAndMapToTarget = (
  extensions: AppExtension[],
  target: AppExtensionTargetEnum,
  openApp: (appData: AppData) => void
): Extension[] =>
  extensions
    .filter(app => app.target === target)
    .map(({ app, url, label }) => ({
      app,
      url,
      label,
      open: () =>
        openApp({ appToken: app.accessToken, backendUrl: url, src: url, label })
    }));

export const useExtensions = (
  view: AppExtensionViewEnum,
  type: AppExtensionTypeEnum
): Record<Target, Extension[]> => {
  const { openApp } = useExternalApp();
  const { data } = useExtensionList({
    fetchPolicy: "cache-first",
    variables: {
      filter: {
        view,
        type
      }
    }
  });
  const extensions = mapEdgesToItems(data?.appExtensions) || [];

  const targetCreate = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.CREATE,
    openApp
  );
  const targetMoreActions = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.MORE_ACTIONS,
    openApp
  );

  return {
    create: targetCreate,
    moreActions: targetMoreActions
  };
};
