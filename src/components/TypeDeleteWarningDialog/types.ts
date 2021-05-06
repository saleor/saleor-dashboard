import { MessageDescriptor } from "react-intl";

export type CommonTypeDeleteWarningMessages = Record<
  "singleTitle" | "multipleTitle" | "viewAssignedItemsButtonLabel",
  MessageDescriptor
>;

export type TypeDeleteWarningMessages = Partial<
  Record<"description" | "consentLabel", MessageDescriptor>
>;
