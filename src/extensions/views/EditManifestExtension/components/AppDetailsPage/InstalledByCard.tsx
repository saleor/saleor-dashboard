import { Date } from "@dashboard/components/Date/Date";
import { type AppQuery } from "@dashboard/graphql";
import { getUserName } from "@dashboard/misc";
import { Box, type BoxProps, Skeleton, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type AppTokens = NonNullable<NonNullable<AppQuery["app"]>["tokens"]>;

/**
 * The API exposes the installer on `AppInstallation`, which is dropped once the installation
 * succeeds - `App` itself has no such field. Installing mints the app's first token on the
 * installer's behalf, so the oldest token's author is the closest available answer.
 *
 * ponytail: heuristic - a deleted first token shifts the answer to the next oldest one.
 * Replace with `App.installedBy` if Core ever exposes it.
 */
export const getInstaller = (tokens: AppTokens) =>
  [...tokens]
    .filter(token => token.createdAt && token.createdBy)
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))[0];

type InstalledByCardProps = {
  tokens: AppTokens | null | undefined;
  loading: boolean;
} & BoxProps;

export const InstalledByCard = ({ tokens, loading, ...boxProps }: InstalledByCardProps) => {
  const intl = useIntl();
  const installer = tokens ? getInstaller(tokens) : undefined;

  // `createdBy` needs MANAGE_STAFF and is null for apps installed before Saleor tracked it
  if (!loading && !installer) {
    return null;
  }

  return (
    <Box {...boxProps} data-test-id="app-installed-by">
      <Text size={5} fontWeight="bold" as="h2" marginBottom={4}>
        {intl.formatMessage(messages.installedByTitle)}
      </Text>
      <Box>
        {loading || !installer ? (
          <Skeleton />
        ) : (
          <Text>
            <FormattedMessage
              {...messages.installedByDescription}
              values={{
                user: getUserName(installer.createdBy, true),
                date: <Date date={installer.createdAt} plain />,
              }}
            />
          </Text>
        )}
      </Box>
    </Box>
  );
};
