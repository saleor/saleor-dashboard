import Skeleton from "@dashboard/components/Skeleton";
import { PermissionEnum } from "@dashboard/graphql";
import { Box, BoxProps, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import messages from "./messages";

type PermissionsCardProps = {
  permissions: Array<{
    name: string;
    code: PermissionEnum;
  }> | null;
  loading: boolean;
} & BoxProps;

export const PermissionsCard: React.FC<PermissionsCardProps> = ({
  permissions,
  loading,
  ...boxProps
}) => {
  const intl = useIntl();

  const renderContent = () => {
    if (loading) {
      return <Skeleton />;
    }

    if (permissions && permissions.length === 0) {
      return <Text>{intl.formatMessage(messages.appNoPermissions)}</Text>;
    }

    if (permissions && permissions.length > 0) {
      return (
        <>
          <Text as={"p"} marginBottom={4}>
            <FormattedMessage {...messages.appPermissionsDescription} />
          </Text>
          <Box as={"ul"}>
            {permissions?.map(perm => (
              <Box as={"li"} paddingX={4} paddingY={2} key={perm.code}>
                <Text>{perm.name}</Text>
              </Box>
            ))}
          </Box>
        </>
      );
    }

    throw new Error('Leaking "if" statement, should never happen');
  };

  return (
    <Box {...boxProps}>
      <Text variant={"heading"} marginBottom={4} as={"h2"}>
        {intl.formatMessage(messages.appPermissionsTitle)}
      </Text>
      <Box>{renderContent()}</Box>
    </Box>
  );
};
