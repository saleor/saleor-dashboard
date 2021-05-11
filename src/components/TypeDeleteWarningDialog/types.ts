import { MessageDescriptor } from "react-intl";

export type CommonTypeDeleteWarningMessages = Record<
  "title" | "viewAssignedItemsButtonLabel",
  MessageDescriptor
>;

export type TypeDeleteWarningMessages = Partial<
  Record<"description" | "consentLabel", MessageDescriptor>
>;
