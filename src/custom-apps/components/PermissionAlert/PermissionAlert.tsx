import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { Alert, Pill } from "@saleor/macaw-ui";
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
        >
          <Typography>
            <div style={{ display: "flex", gap: "12px" }}>
              {permissions.map(permission => (
                <Pill
                  size="small"
                  color="generic"
                  outlined
                  label={permission}
                />
              ))}
            </div>
          </Typography>
        </Alert>
      )}
    </div>
  );
};

PermissionAlert.displayName = "PermissionAlert";
export default PermissionAlert;
