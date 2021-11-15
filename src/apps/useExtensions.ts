import {
  AppExtensionTargetEnum,
  AppExtensionTypeEnum,
  AppExtensionViewEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems } from "@saleor/utils/maps";

import { AppData, useExternalApp } from "./components/ExternalAppContext";
import { useExtensionList } from "./queries";
import { ExtensionList_appExtensions_edges_node } from "./types/ExtensionList";

interface Extension {
  id: string;
  accessToken: string;
  label: string;
  url: string;
  open(): void;
}
type Target = "create" | "moreActions";

const filterAndMapToTarget = (
  extensions: ExtensionList_appExtensions_edges_node[],
  target: AppExtensionTargetEnum,
  openApp: (appData: AppData) => void
): Extension[] =>
  extensions
    .filter(app => app.target === target)
    .map(({ id, accessToken, url, label }) => ({
      id,
      accessToken,
      url,
      label,
      open: () => openApp({ appToken: accessToken, src: url, label })
    }));

export const mapToMenuItems = (extensions: Extension[]) =>
  extensions.map(({ label, id, open }) => ({
    label,
    testId: `extension-${id}`,
    onSelect: open
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
