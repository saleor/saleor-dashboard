import { useQuery } from "@apollo/client";
import { Alert } from "@saleor/macaw-ui";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import {
  buildPermissionMap,
  getPermissions,
  IntrospectionQuery,
} from "./utils";

export interface PermissionAlertProps {
  query: string;
}

const PermissionAlert: React.FC<PermissionAlertProps> = ({ query }) => {
  const intl = useIntl();

  const { data } = useQuery(IntrospectionQuery, {
    fetchPolicy: "network-only",
  });
  const elements = data?.__schema?.types || [];
  const permissionMapping = buildPermissionMap(elements);
  const permissions = getPermissions(query, permissionMapping);

  return (
    <div data-test-id="permission-alert">
      {permissions.length > 0 && (
        <Alert
          title={intl.formatMessage({
            id: "ngSJ7N",
            defaultMessage:
              "Your subscription query requires the following permissions:",
            description: "alert title",
          })}
          variant="warning"
          close={false}
          className="remove-icon-background"
        >
          <Box display="flex" gap={2}>
            {permissions.map(permission => (
              <Chip size="small" key={permission}>
                <Text size={1}>{permission}</Text>
              </Chip>
            ))}
          </Box>
        </Alert>
      )}
    </div>
  );
};

PermissionAlert.displayName = "PermissionAlert";
export default PermissionAlert;
