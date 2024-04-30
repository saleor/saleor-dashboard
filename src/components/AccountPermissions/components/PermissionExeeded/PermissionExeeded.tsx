import { UserPermissionFragment } from "@dashboard/graphql";
import { Box, List, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "../../messages";

interface PermissionsExceededProps {
  userPermissions: UserPermissionFragment[];
}

export const PermissionsExceeded = ({ userPermissions }: PermissionsExceededProps) => {
  const intl = useIntl();

  return (
    <>
      <Text as="p">{intl.formatMessage(messages.exeededPermission)}</Text>

      <Box
        width="100%"
        borderBottomStyle="solid"
        borderBottomWidth={1}
        borderColor="default1"
        height={1}
        marginTop={6}
        marginBottom={6}
      />

      <Text>{intl.formatMessage(messages.availablePermissions)}</Text>

      <List>
        {userPermissions.map(perm => (
          <List.Item
            key={perm.code}
            marginY={4}
            marginLeft={4}
            cursor="text"
            backgroundColor={{
              hover: "default1Hovered",
            }}
          >
            <Text size={3}>{`- ${perm.name}`}</Text>
          </List.Item>
        ))}
      </List>
    </>
  );
};
