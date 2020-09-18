import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import useUser from "@saleor/hooks/useUser";
import { PermissionData } from "@saleor/permissionGroups/components/PermissionGroupDetailsPage";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupCreatePage from "../../components/PermissionGroupCreatePage";
import { usePermissionGroupCreate } from "../../mutations";
import { PermissionGroupCreate } from "../../types/PermissionGroupCreate";
import { permissionGroupDetailsUrl, permissionGroupListUrl } from "../../urls";

const PermissionGroupCreateView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const user = useUser();

  const handleSuccess = (data: PermissionGroupCreate) => {
    if (data?.permissionGroupCreate?.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Permission group created"
        })
      });
      navigate(permissionGroupDetailsUrl(data.permissionGroupCreate.group.id));
    }
  };

  const [
    createPermissionGroup,
    createPermissionGroupResult
  ] = usePermissionGroupCreate({
    onCompleted: handleSuccess
  });

  const errors =
    createPermissionGroupResult?.data?.permissionGroupCreate?.errors || [];

  const onSubmit = formData =>
    createPermissionGroup({
      variables: {
        input: {
          addPermissions: formData.hasFullAccess
            ? shop.permissions.map(perm => perm.code)
            : formData.permissions,
          addUsers: [],
          name: formData.name
        }
      }
    });

  const userPermissions = user?.user.userPermissions.map(p => p.code) || [];

  const permissions: PermissionData[] =
    shop?.permissions.map(
      p =>
        ({
          ...p,
          disabled: !userPermissions.includes(p.code),
          lastSource: false
        } as PermissionData)
    ) || [];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          defaultMessage: "Create category",
          description: "window title"
        })}
      />
      <PermissionGroupCreatePage
        errors={errors}
        disabled={createPermissionGroupResult.loading}
        permissions={permissions}
        saveButtonBarState={createPermissionGroupResult.status}
        onSubmit={onSubmit}
        onBack={() => navigate(permissionGroupListUrl())}
      />
    </>
  );
};
PermissionGroupCreateView.displayName = "PermissionGroupCreateView";

export default PermissionGroupCreateView;
