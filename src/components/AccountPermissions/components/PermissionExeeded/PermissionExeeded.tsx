import { UserPermissionFragment } from "@dashboard/graphql";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui/next";
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

      <List dense={true}>
        {userPermissions.map(perm => (
          <ListItem key={perm.code}>
            <ListItemText primary={`- ${perm.name}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
