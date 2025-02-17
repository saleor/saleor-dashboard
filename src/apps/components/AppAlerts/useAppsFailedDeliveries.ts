import { useUser } from "@dashboard/auth";
import { hasAllPermissions } from "@dashboard/auth/misc";
import { PermissionEnum, useAppFailedPendingWebhooksLazyQuery } from "@dashboard/graphql";
import { useMemo } from "react";

import { webhookFailedAttemptsCheck } from "./utils";

interface AppsFailedDeliveries {
  hasFailed: boolean;
  fetchAppsWebhooks: () => void;
}

const requiredPermissions = [PermissionEnum.MANAGE_APPS];

export const useAppsFailedDeliveries = (): AppsFailedDeliveries => {
  const { user } = useUser();
  const hasRequiredPermissions = user ? hasAllPermissions(requiredPermissions, user) : false;

  const [fetchAppsWebhooks, { data }] = useAppFailedPendingWebhooksLazyQuery();

  const hasFailed = useMemo(
    () =>
      data?.apps?.edges.some(app => app.node.webhooks?.some(webhookFailedAttemptsCheck), false) ??
      false,
    [data],
  );

  const handleFetchAppsWebhooks = () => {
    if (hasRequiredPermissions) {
      fetchAppsWebhooks();
    }
  };

  return {
    hasFailed,
    fetchAppsWebhooks: handleFetchAppsWebhooks,
  };
};
