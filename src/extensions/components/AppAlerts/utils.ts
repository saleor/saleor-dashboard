// Placeholder utility functions for app alerts
// Since we're removing the apps system, these can be simplified

import moment from "moment";

export interface LatestWebhookDeliveryWithMoment {
  id: string;
  createdAt: moment.Moment | string;
  status: string;
}

export const getAppErrorsCountableActionMessageProps = () => ({
  message: "",
  status: "success" as const,
});

export const getAppInstallErrorMessage = () => "";

export const getAppDeactivatedMessage = () => "";

export const getAppActivatedMessage = () => "";

export const getLatestFailedAttemptFromWebhooks = (_webhooks?: any[]): LatestWebhookDeliveryWithMoment | null => {
  return null;
};