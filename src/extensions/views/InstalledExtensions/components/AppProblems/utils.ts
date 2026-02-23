import { problemMessages } from "@dashboard/extensions/messages";
import {
  AppProblem,
  getProblemSortDate,
  isProblemCritical,
  isProblemDismissed,
} from "@dashboard/extensions/types";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppTypeEnum } from "@dashboard/graphql";

export const sortProblems = (problems: AppProblem[]): AppProblem[] =>
  [...problems].sort((a, b) => {
    const aDismissed = isProblemDismissed(a);
    const bDismissed = isProblemDismissed(b);

    // Dismissed always after non-dismissed
    if (aDismissed !== bDismissed) {
      return aDismissed ? 1 : -1;
    }

    const aCritical = isProblemCritical(a);
    const bCritical = isProblemCritical(b);

    // Critical before non-critical
    if (aCritical !== bCritical) {
      return aCritical ? -1 : 1;
    }

    // Newest first (by updatedAt / createdAt)
    return new Date(getProblemSortDate(b)).getTime() - new Date(getProblemSortDate(a)).getTime();
  });

export const getActionLink = (
  problem: AppProblem,
  appId: string,
  appType?: AppTypeEnum | null,
): { href: string; label: keyof typeof problemMessages } | null => {
  if (problem.__typename === "WebhookDeliveryError") {
    return {
      href: ExtensionsUrls.resolveEditManifestExtensionUrl(appId),
      label: "checkWebhooks",
    };
  }

  if (problem.__typename === "AppProblem" && appType === AppTypeEnum.THIRDPARTY) {
    return {
      href: ExtensionsUrls.resolveViewManifestExtensionUrl(appId),
      label: "openTheApp",
    };
  }

  return null;
};
