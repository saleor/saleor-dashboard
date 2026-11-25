import { isValidElement, type ReactNode } from "react";
import { type IntlShape, type MessageDescriptor } from "react-intl";

import { type RippleText } from "./types";

const isMessageDescriptor = (value: unknown): value is MessageDescriptor =>
  typeof value === "object" && value !== null && !isValidElement(value) && "id" in value;

/**
 * Translates ripple text given as a message descriptor. Plain strings and React nodes (already
 * built with FormattedMessage) are returned unchanged.
 */
export function formatRippleText(intl: IntlShape, value: RippleText): string;
export function formatRippleText(intl: IntlShape, value: RippleText | ReactNode): ReactNode;
export function formatRippleText(intl: IntlShape, value: RippleText | ReactNode): ReactNode {
  return isMessageDescriptor(value) ? intl.formatMessage(value) : value;
}
