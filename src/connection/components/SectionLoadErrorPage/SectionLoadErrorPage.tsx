import { pageViewportHeight } from "@dashboard/components/AppLayout/consts";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { connectionMessages as messages } from "../../messages";

interface SectionLoadErrorPageProps {
  /** The connection banner shows an outage, so the page waits for it to end. */
  connectionLost: boolean;
  onReload: () => void;
}

/** Takes the place of a page whose code couldn't be downloaded. */
export const SectionLoadErrorPage = ({
  connectionLost,
  onReload,
}: SectionLoadErrorPageProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={6}
      __minHeight={pageViewportHeight}
      data-test-id="section-load-error"
      data-test-state={connectionLost ? "waiting" : "reload"}
    >
      <Box display="flex" flexDirection="column" alignItems="flex-start" gap={3} __maxWidth="400px">
        <Text as="h1" size={6} fontWeight="bold">
          {intl.formatMessage(messages.sectionLoadFailedTitle)}
        </Text>
        <Text color="default2">
          {intl.formatMessage(
            connectionLost ? messages.sectionLoadWaiting : messages.loadFailedDescription,
          )}
        </Text>
        {/* Reloading while the connection is lost would only show the browser's error page. */}
        {!connectionLost && (
          <Button variant="secondary" onClick={onReload} data-test-id="section-load-error-reload">
            {intl.formatMessage(messages.reloadPage)}
          </Button>
        )}
      </Box>
    </Box>
  );
};
