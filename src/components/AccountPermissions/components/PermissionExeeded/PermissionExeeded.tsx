import { UserPermissionFragment } from "@dashboard/graphql";
import { Box, List, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

interface PermissionsExceededProps {
  userPermissions: UserPermissionFragment[];
}

export const PermissionsExceeded = ({
  userPermissions,
}: PermissionsExceededProps) => {
  const intl = useIntl();

  return (
    <>
      <Text as="p" variant="body">
        {intl.formatMessage(messages.exeededPermission)}
      </Text>

      <Box
        width="100%"
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderColor="neutralPlain"
        height={1}
        marginTop={6}
        marginBottom={6}
      />

      <Text variant="body">
        {intl.formatMessage(messages.availablePermissions)}
      </Text>

      <List>
        {userPermissions.map(perm => (
          <List.Item
            key={perm.code}
            marginY={4}
            marginLeft={4}
            cursor="text"
            backgroundColor={{
              hover: "interactiveNeutralHighlightDefault",
            }}
          >
            <Text variant="caption" size="large">{`- ${perm.name}`}</Text>
          </List.Item>
        ))}
      </List>
    </>
  );
};
