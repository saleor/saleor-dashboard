import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorFragment,
  UserPermissionFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  MembersListUrlSortField,
  permissionGroupListUrl,
} from "@dashboard/permissionGroups/urls";
import {
  extractPermissionCodes,
  isGroupFullAccess,
} from "@dashboard/permissionGroups/utils";
import { ListActions, SortPage } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupInfo from "../PermissionGroupInfo";
import PermissionGroupMemberList from "../PermissionGroupMemberList";

export interface PermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetailsFragment["users"];
  channels: ChannelFragment[];
}

export interface PermissionData
  extends Omit<UserPermissionFragment, "__typename"> {
  lastSource?: boolean;
  disabled?: boolean;
}

export interface PermissionGroupDetailsPageProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  channels: ChannelFragment[];
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  members: PermissionGroupDetailsFragment["users"];
  permissionGroup: PermissionGroupDetailsFragment;
  permissions: PermissionData[];
  permissionsExceeded: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAssign: () => void;
  onUnassign: (ids: string[]) => void;
  onSubmit: (data: PermissionGroupDetailsPageFormData) => SubmitPromise;
}

const PermissionGroupDetailsPage: React.FC<PermissionGroupDetailsPageProps> = ({
  disabled,
  errors,
  members,
  onSubmit,
  permissionGroup,
  permissions,
  permissionsExceeded,
  saveButtonBarState,
  channels,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: PermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    hasAllChannels: !permissionGroup?.restrictedAccessToChannels ?? false,
    channels: permissionGroup?.accessibleChannels ?? [],
    isActive: false,
    name: permissionGroup?.name || "",
    permissions: extractPermissionCodes(permissionGroup),
    users: members,
  };

  const formErrors = getFormErrors(["addPermissions"], errors);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl,
  );

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, change, submit }) => (
        <DetailPageLayout>
          <TopNav
            href={permissionGroupListUrl()}
            title={permissionGroup?.name}
          />
          <DetailPageLayout.Content>
            <PermissionGroupInfo
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <FormSpacer />
            <PermissionGroupMemberList
              disabled={disabled}
              {...listProps}
              users={data?.users || []}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <Box display="grid" __gridTemplateRows="50%  50%" height="100vh">
              <AccountPermissions
                permissionsExceeded={permissionsExceeded}
                data={data}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                errorMessage={permissionsError}
                fullAccessLabel={intl.formatMessage({
                  id: "mAabef",
                  defaultMessage: "Group has full access to the store",
                  description: "checkbox label",
                })}
                description={intl.formatMessage({
                  id: "CYZse9",
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description",
                })}
              />
              <ChannelPermission
                description="Expand or restrict channels permissions"
                fullAccessLabel="Group has full access to all channels"
                channels={channels}
                onChange={change}
                disabled={disabled}
                data={data}
              />
            </Box>
          </DetailPageLayout.RightSidebar>
          <div>
            <Savebar
              onCancel={() => navigate(permissionGroupListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={disabled}
            />
          </div>
        </DetailPageLayout>
      )}
    </Form>
  );
};
PermissionGroupDetailsPage.displayName = "PermissionGroupDetailsPage";
export default PermissionGroupDetailsPage;
