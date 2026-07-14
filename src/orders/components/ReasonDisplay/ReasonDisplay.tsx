import { Text } from "@saleor/macaw-ui-next";
import { type ComponentProps } from "react";

interface ReasonDisplayProps {
  /** Structured reason reference title, rendered bold before the note. */
  reasonReference?: string | null;
  /** Free-text reason note, rendered after the reference. */
  reason?: string | null;
  ellipsis?: boolean;
  display?: ComponentProps<typeof Text>["display"];
}

/**
 * Renders a saved refund/return reason as a single line:
 * `<strong>{reasonReference}</strong>: {reason}`.
 *
 * Either part may be missing — the colon only appears when both are present.
 * Returns `null` when there is nothing to show.
 */
export const ReasonDisplay = ({
  reasonReference,
  reason,
  ellipsis,
  display,
}: ReasonDisplayProps) => {
  if (!reasonReference && !reason) {
    return null;
  }

  return (
    <Text ellipsis={ellipsis} display={display} size={2} color="default2">
      {reasonReference && (
        <Text as="span" size={2} fontWeight="medium" color="default1">
          {reasonReference}
          {reason ? ": " : ""}
        </Text>
      )}
      {reason}
    </Text>
  );
};
