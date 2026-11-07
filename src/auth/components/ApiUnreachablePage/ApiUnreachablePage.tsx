import { ButtonWithLoader } from "@dashboard/components/ButtonWithLoader/ButtonWithLoader";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { apiUnreachableMessages as messages } from "./messages";

interface ApiUnreachablePageProps {
  /** Host of the Saleor API, so a self-hosted setup can spot a wrong address. */
  apiHost: string | null;
  retrying: boolean;
  onRetry: () => void;
  onSignIn: () => void;
}

/**
 * Shown instead of the sign-in form when the stored session couldn't be checked at startup
 * because Saleor didn't answer. Signing in can't work while the API is unreachable, and the
 * stored session may still be valid.
 */
export const ApiUnreachablePage = ({
  apiHost,
  retrying,
  onRetry,
  onSignIn,
}: ApiUnreachablePageProps): React.ReactNode => {
  const intl = useIntl();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      gap={4}
      width="100%"
      data-test-id="api-unreachable"
    >
      <Text as="h1" size={6} fontWeight="bold" lineHeight={3}>
        {intl.formatMessage(messages.title)}
      </Text>
      <Text>{intl.formatMessage(messages.description)}</Text>
      {apiHost && (
        <Text size={2} color="default2" data-test-id="api-unreachable-host">
          {intl.formatMessage(messages.apiAddress, { host: apiHost })}
        </Text>
      )}
      <ButtonWithLoader
        width="100%"
        variant="primary"
        transitionState={retrying ? "loading" : "default"}
        disabled={retrying}
        onClick={onRetry}
        data-test-id="api-unreachable-retry"
      >
        {intl.formatMessage(messages.tryAgain)}
      </ButtonWithLoader>
      <Button
        width="100%"
        variant="tertiary"
        onClick={onSignIn}
        data-test-id="api-unreachable-sign-in"
      >
        {intl.formatMessage(messages.signIn)}
      </Button>
    </Box>
  );
};
