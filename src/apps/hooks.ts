import { AppFragment } from "@saleor/fragments/types/AppFragment";
import {
  AppExtensionTargetEnum,
  AppExtensionTypeEnum,
  AppExtensionViewEnum
} from "@saleor/types/globalTypes";
import { mapEdgesToItems } from "@saleor/utils/maps";

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
}
type Target = "create" | "moreActions";

const filterAndMapToTarget = (
  extensions: AppExtension[],
  target: AppExtensionTargetEnum
): Extension[] =>
  extensions
    .filter(app => app.target === target)
    .map(({ app, url, label }) => ({
      app,
      url,
      label
    }));

export const useExtensions = (
  view: AppExtensionViewEnum,
  type: AppExtensionTypeEnum
): Record<Target, Extension[]> => {
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
    AppExtensionTargetEnum.CREATE
  );
  const targetMoreActions = filterAndMapToTarget(
    extensions,
    AppExtensionTargetEnum.MORE_ACTIONS
  );

  return {
    create: targetCreate,
    moreActions: targetMoreActions
  };
};
