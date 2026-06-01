import { Box, Text } from "@saleor/macaw-ui-next";
import { Lock } from "lucide-react";
import type * as React from "react";
import { FormattedMessage } from "react-intl";

interface ReadOnlyLabelProps {
  /**
   * Override the default "Read-only" copy. Pass a `<FormattedMessage>` (or
   * any node) when a page wants to add a permission hint, e.g. "Read-only —
   * editing requires Manage users".
   */
  children?: React.ReactNode;
}

/**
 * Slot for the Savebar shown on permission-gated detail pages where the
 * current user can read but not write. Renders a muted "Read-only" pill so
 * the savebar slot stays visually anchored instead of collapsing into an
 * empty strip — matching the layout users see in edit mode.
 */
export const ReadOnlyLabel = ({ children }: ReadOnlyLabelProps) => (
  <Box display="flex" alignItems="center" gap={2} data-test-id="savebar-read-only">
    <Box display="flex" alignItems="center" color="default2" aria-hidden="true">
      <Lock size={14} />
    </Box>
    <Text size={3} color="default2">
      {children ?? (
        <FormattedMessage
          defaultMessage="Read-only"
          description="savebar label shown on detail pages where the current user lacks permission to edit"
          id="qjT9IB"
        />
      )}
    </Text>
  </Box>
);
