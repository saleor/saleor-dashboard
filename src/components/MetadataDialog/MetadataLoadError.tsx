import { buttonMessages } from "@dashboard/intl";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface MetadataLoadErrorProps {
  onRetry: () => void;
}

/** Shown in a metadata dialog instead of the editors when its metadata couldn't be loaded,
 * so an empty form is never mistaken for "no metadata" and saved. */
export const MetadataLoadError = ({ onRetry }: MetadataLoadErrorProps): React.ReactNode => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="flex-start"
    gap={3}
    paddingY={6}
    role="alert"
    data-test-id="metadata-load-error"
  >
    <Text size={3} fontWeight="medium" color="critical1">
      <FormattedMessage {...messages.loadFailed} />
    </Text>
    <Button variant="secondary" onClick={onRetry} data-test-id="metadata-load-retry">
      <FormattedMessage {...buttonMessages.retry} />
    </Button>
  </Box>
);
