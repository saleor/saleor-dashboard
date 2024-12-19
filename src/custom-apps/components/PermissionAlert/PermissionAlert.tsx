import { gql, useQuery } from "@apollo/client";
import { Alert } from "@saleor/macaw-ui";
import { Box, Chip, Text } from "@saleor/macaw-ui-next";
import { getIntrospectionQuery } from "graphql";
import { useIntl } from "react-intl";

import { getPermissions } from "./utils";

export interface PermissionAlertProps {
  query: string;
}

const PermissionAlert = ({ query }: PermissionAlertProps) => {
  const intl = useIntl();
  const introQuery = getIntrospectionQuery();
  const { data } = useQuery(gql(introQuery), {
    fetchPolicy: "network-only",
  });
  const permissionInfo = getPermissions(query, data);
  const hasPermissions = permissionInfo && Object.entries(permissionInfo).length > 0;

  return (
    <div data-test-id="permission-alert">
      {hasPermissions && (
        <Alert
          title={intl.formatMessage({
            id: "ngSJ7N",
            defaultMessage: "Your subscription query requires the following permissions:",
            description: "alert title",
          })}
          variant="warning"
          close={false}
          className="remove-icon-background"
        >
          <Box display="flex" flexDirection="column" gap={2}>
            {Object.entries(permissionInfo).map(
              ([subscription, { isOneOfRequired, permissions }]) => (
                <Box key={subscription} display="flex" gap={1}>
                  <Text>
                    {intl.formatMessage({
                      id: "0YjGFG",
                      defaultMessage: "For subscription",
                      description: "alert message",
                    })}
                  </Text>
                  <Chip backgroundColor="info1" color="default1">
                    {subscription}
                  </Chip>
                  <Text>
                    {isOneOfRequired
                      ? intl.formatMessage({
                          id: "I/y4IU",
                          defaultMessage: "one of",
                          description: "alert message",
                        })
                      : intl.formatMessage({
                          defaultMessage: "all of",
                          id: "C+WD8j",
                          description: "alert message",
                        })}
                  </Text>
                  {permissions.map(permission => (
                    <Chip
                      key={permission}
                      backgroundColor={isOneOfRequired ? "warning1" : "critical1"}
                      color={isOneOfRequired ? "warning1" : "critical1"}
                    >
                      {permission}
                    </Chip>
                  ))}
                </Box>
              ),
            )}
          </Box>
        </Alert>
      )}
    </div>
  );
};

PermissionAlert.displayName = "PermissionAlert";
export default PermissionAlert;
