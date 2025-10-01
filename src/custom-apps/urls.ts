import { Dialog, SingleAction } from "../types";

type CustomAppDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";
export type CustomAppDetailsUrlQueryParams = Dialog<CustomAppDetailsUrlDialog> & SingleAction;

export const CustomAppSections = {
  appsSection: "/custom-apps/",
  webhooksSection: "/webhooks/",
};
