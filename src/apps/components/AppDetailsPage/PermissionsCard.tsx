// @ts-strict-ignore
import Skeleton from "@dashboard/components/Skeleton";
import { AppQuery } from "@dashboard/graphql";
import { Box, BoxProps, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type PermissionsCardProps = {
  permissions?: AppQuery["app"]["permissions"];
  loading: boolean;
} & BoxProps;

export const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissions,
  loading,
  ...boxProps
}) => {
  const intl = useIntl();

  const noPermissions = (
    <Text>{intl.formatMessage(messages.appNoPermissions)}</Text>
  );

  return (
    <Box {...boxProps}>
      <Text variant={"heading"} marginBottom={4} as={"h2"}>
        {intl.formatMessage(messages.appPermissionsTitle)}
      </Text>
      <Box>
        {!loading ? (
          <>
            <Text as={"p"} marginBottom={4}>
              <FormattedMessage {...messages.appPermissionsDescription} />
            </Text>
            {permissions.length === 0 && noPermissions}
            {permissions?.length && (
              <Box as={"ul"}>
                {permissions?.map(perm => (
                  <Box as={"li"} paddingX={4} paddingY={2} key={perm.code}>
                    <Text>{perm.name}</Text>
                  </Box>
                ))}
              </Box>
            )}
          </>
        ) : (
          <Skeleton />
        )}
      </Box>
    </Box>
  );
};
