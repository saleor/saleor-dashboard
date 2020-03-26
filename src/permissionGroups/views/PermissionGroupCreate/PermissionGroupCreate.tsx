import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";

import { PermissionGroupCreate } from "../../types/PermissionGroupCreate";
import { permissionGroupListUrl, permissionGroupDetailsUrl } from "../../urls";
import { usePermissionGroupCreate } from "../../mutations";
import PermissionGroupCreatePage from "../../components/PermissionGroupCreatePage";

const PermissionGroupCreateView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  const handleSuccess = (data: PermissionGroupCreate) => {
    if (data?.permissionGroupCreate?.errors.length === 0) {
      notify({
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
          name: formData.name,
          permissions: formData.hasFullAccess
            ? shop.permissions.map(perm => perm.code)
            : formData.permissions,
          users: []
        }
      }
    });

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
        permissions={shop?.permissions}
        saveButtonBarState={createPermissionGroupResult.status}
        onSubmit={onSubmit}
        onBack={() => navigate(permissionGroupListUrl())}
      />
    </>
  );
};
PermissionGroupCreateView.displayName = "PermissionGroupCreateView";

export default PermissionGroupCreateView;
