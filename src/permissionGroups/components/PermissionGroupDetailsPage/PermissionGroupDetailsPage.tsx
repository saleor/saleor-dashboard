import { useUser } from "@dashboard/auth";
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorFragment,
  UserPermissionFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages } from "@dashboard/intl";
import { MembersListUrlSortField, permissionGroupListPath } from "@dashboard/permissionGroups/urls";
import { ListActions, SortPage } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import {
  checkIfUserHasRestictedAccessToChannels,
  extractPermissionCodes,
  getInitialChannels,
  getUserAccessibleChannelsOptions,
  isGroupFullAccess,
} from "../../utils";
import PermissionGroupInfo from "../PermissionGroupInfo";
import PermissionGroupMemberList from "../PermissionGroupMemberList";

export interface PermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetailsFragment["users"];
  channels: string[];
}

export interface PermissionData extends Omit<UserPermissionFragment, "__typename"> {
  lastSource?: boolean;
  disabled?: boolean;
}

export interface PermissonGroupDetailsPageProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  channels: ChannelFragment[];
  disabled: boolean;
  isUserAbleToEditChannels: boolean;
  errors: PermissionGroupErrorFragment[];
  members: PermissionGroupDetailsFragment["users"];
  permissionGroup: PermissionGroupDetailsFragment | null | undefined;
  permissions: PermissionData[];
  permissionsExceeded: boolean;
  saveButtonBarState: "loading" | "success" | "error" | "default";
  onAssign: () => void;
  onDelete: () => void;
  onUnassign: (ids: string[]) => void;
  onSubmit: (data: PermissionGroupDetailsPageFormData) => SubmitPromise;
}

export const PermissionGroupDetailsPage: React.FC<PermissonGroupDetailsPageProps> = ({
  disabled,
  errors,
  members,
  onSubmit,
  onDelete,
  permissionGroup,
  permissions,
  permissionsExceeded,
  saveButtonBarState,
  channels,
  isUserAbleToEditChannels,
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const user = useUser();
  const channelsOptions = getUserAccessibleChannelsOptions(channels, user.user);
  const hasUserRestrictedChannels = checkIfUserHasRestictedAccessToChannels(user.user);
  const initialForm: PermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    hasAllChannels: !permissionGroup?.restrictedAccessToChannels ?? false,
    channels: getInitialChannels(permissionGroup, channels?.length ?? 0),
    isActive: false,
    name: permissionGroup?.name || "",
    permissions: extractPermissionCodes(permissionGroup),
    users: members,
  };
  const formErrors = getFormErrors(["addPermissions"], errors);
  const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

  const permissionGroupListBackLink = useBackLinkWithState({
    path: permissionGroupListPath,
  });

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, change, submit }) => {
        const handleChannelChange: FormChange = event => {
          change({
            target: {
              name: "channels",
              value: event.target.value,
            },
          });
        };
        const handleHasAllChannelsChange = () => {
          change({
            target: {
              name: "hasAllChannels",
              value: !data.hasAllChannels,
            },
          });
        };

        return (
          <DetailPageLayout>
            <TopNav href={permissionGroupListBackLink} title={permissionGroup?.name} />
            <DetailPageLayout.Content>
              <PermissionGroupInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />

              <FormSpacer />

              <Box paddingX={6}>
                <ChannelPermission
                  allChannels={
                    // I pass all channels because Multiselect components based on ids,
                    // and need data that will take information about channel
                    !isUserAbleToEditChannels ? channels : channelsOptions
                  }
                  hasAllChannels={data.hasAllChannels}
                  selectedChannels={data.channels}
                  onHasAllChannelsChange={handleHasAllChannelsChange}
                  onChannelChange={handleChannelChange}
                  disabled={!isUserAbleToEditChannels || disabled}
                  disabledSelectAllChannels={hasUserRestrictedChannels}
                />
              </Box>

              <FormSpacer />
              <PermissionGroupMemberList
                disabled={disabled}
                {...listProps}
                users={data?.users || []}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <AccountPermissions
                permissionsExceeded={permissionsExceeded}
                data={data}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                errorMessage={permissionsError}
                fullAccessLabel={intl.formatMessage(buttonMessages.selectAll)}
                description={intl.formatMessage({
                  id: "CYZse9",
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description",
                })}
              />
            </DetailPageLayout.RightSidebar>
            <div>
              <Savebar>
                <Savebar.DeleteButton onClick={onDelete} />
                <Savebar.Spacer />
                <Savebar.CancelButton onClick={() => navigate(permissionGroupListBackLink)} />
                <Savebar.ConfirmButton
                  transitionState={saveButtonBarState}
                  onClick={submit}
                  disabled={disabled}
                />
              </Savebar>
            </div>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
