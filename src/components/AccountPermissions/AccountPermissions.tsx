import { useUser } from "@dashboard/auth";
import { PermissionData } from "@dashboard/permissionGroups/components/PermissionGroupDetailsPage";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { Header } from "./components/Header";
import { PermissionsExceeded } from "./components/PermissionExeeded";
import { PermissionList } from "./components/PermissionList";
import { messages } from "./messages";

interface AccountPermissionsProps {
  permissions: PermissionData[];
  permissionsExceeded: boolean;
  data: {
    hasFullAccess: boolean;
    permissions: string[];
  };
  disabled: boolean;
  description: string;
  errorMessage: string | undefined;
  fullAccessLabel: string;
  onChange: (event: React.ChangeEvent<any>, cb?: () => void) => void;
}

const AccountPermissions: React.FC<AccountPermissionsProps> = props => {
  const {
    data,
    disabled,
    permissionsExceeded,
    onChange,
    description,
    fullAccessLabel,
    errorMessage,
  } = props;
  const permissions = Object.values(props?.permissions ?? {}).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  const intl = useIntl();
  const { user } = useUser();
  const handleFullAccessChange = () => {
    onChange({
      target: {
        name: "permissions",
        value: !data.hasFullAccess
          ? permissions.filter(perm => !perm.disabled).map(perm => perm.code)
          : [],
      },
    } as ChangeEvent<any>);
    onChange({
      target: {
        name: "hasFullAccess",
        value: !data.hasFullAccess,
      },
    } as ChangeEvent<any>);
  };
  const handlePermissionChange = (key: string, value: boolean) => {
    const updatedPersmissions = !value
      ? data.permissions.concat([key])
      : data.permissions.filter(perm => perm !== key);

    // If all permissions are selected, set hasFullAccess to true
    onChange({
      target: {
        name: "hasFullAccess",
        value: !!(permissions.length === updatedPersmissions.length && !data.hasFullAccess),
      },
    } as ChangeEvent<any>);
    onChange({
      target: {
        name: "permissions",
        value: updatedPersmissions,
      },
    } as ChangeEvent<any>);
  };

  return (
    <Box paddingX={9} paddingY={9} paddingBottom={0}>
      <Text as="p" size={5} fontWeight="medium" marginBottom={7}>
        {intl.formatMessage(messages.title)}
      </Text>

      {permissionsExceeded && <PermissionsExceeded userPermissions={user?.userPermissions ?? []} />}

      {!permissionsExceeded && (
        <>
          <Header
            disabled={disabled}
            description={description}
            fullAccessLabel={fullAccessLabel}
            hasFullAccess={data.hasFullAccess}
            onFullAccessChange={handleFullAccessChange}
          />

          <Box
            width="100%"
            borderBottomStyle="solid"
            borderBottomWidth={1}
            borderColor="default1"
            height={1}
            margin={0}
          />

          <PermissionList
            disabled={disabled}
            permissions={permissions}
            onPermissionChange={handlePermissionChange}
            selectedPermissions={data.permissions}
          />

          {!!errorMessage && (
            <>
              <Box
                width="100%"
                borderBottomStyle="solid"
                borderBottomWidth={1}
                borderColor="default1"
                height={1}
                marginTop={6}
                marginBottom={6}
              />
              <Text as="p" color="critical1">
                {errorMessage}
              </Text>
            </>
          )}
        </>
      )}
    </Box>
  );
};

AccountPermissions.displayName = "AccountPermissions";
export default AccountPermissions;
