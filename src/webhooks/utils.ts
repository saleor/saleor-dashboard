import { WebhookFragment } from "@saleor/fragments/types/WebhookFragment";

export function isUnnamed(webhook: WebhookFragment): boolean {
  return ["", null].includes(webhook?.name);
}
