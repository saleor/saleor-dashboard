import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorFragment,
  UserPermissionFragment,
} from "@dashboard/graphql";
import { NewPermissionGroupDetailsFragment } from "@dashboard/graphql/types.channelPermissions.generated";
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
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import PermissionGroupInfo from "../PermissionGroupInfo";
import PermissionGroupMemberList from "../PermissionGroupMemberList";

export interface NewPermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  hasRestrictedChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetailsFragment["users"];
  channels: string[];
}

export interface NewPermissionData
  extends Omit<UserPermissionFragment, "__typename"> {
  lastSource?: boolean;
  disabled?: boolean;
}

export interface NewPermissionGroupDetailsPageProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  channels: ChannelFragment[];
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  members: PermissionGroupDetailsFragment["users"];
  permissionGroup: NewPermissionGroupDetailsFragment;
  permissions: NewPermissionData[];
  permissionsExceeded: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  onAssign: () => void;
  onUnassign: (ids: string[]) => void;
  onSubmit: (data: NewPermissionGroupDetailsPageFormData) => SubmitPromise;
}

export const NewPermissionGroupDetailsPage: React.FC<
  NewPermissionGroupDetailsPageProps
> = ({
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

  const initialForm: NewPermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    hasRestrictedChannels: permissionGroup?.restrictedAccessToChannels ?? false,
    channels:
      permissionGroup?.accessibleChannels?.length === channels.length
        ? []
        : permissionGroup?.accessibleChannels?.map(channel => channel.id) ?? [],
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

  const [channelsDisplayValues, setChannelDisplayValues] = useState<
    MultiAutocompleteChoiceType[]
  >([]);

  useEffect(() => {
    if (permissionGroup?.accessibleChannels?.length !== channels.length) {
      setChannelDisplayValues(
        mapNodeToChoice(permissionGroup?.accessibleChannels),
      );
    }
  }, [channels.length, permissionGroup?.accessibleChannels]);

  const channelChoices = mapNodeToChoice(channels);

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, change, submit, toggleValue }) => {
        const handleChannelChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setChannelDisplayValues,
          channelsDisplayValues,
          channelChoices,
        );

        return (
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
              <Box display="flex" flexDirection="column" height="100%">
                <Box overflow="hidden" __maxHeight="50%">
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
                </Box>
                <Box overflow="hidden" __maxHeight="50%">
                  <ChannelPermission
                    channelsDisplayValues={channelsDisplayValues}
                    allChannels={channels}
                    hasRestrictedChannels={data.hasRestrictedChannels}
                    selectedChannels={data.channels}
                    onChange={change}
                    onChannelChange={handleChannelChange}
                    disabled={disabled}
                  />
                </Box>
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
        );
      }}
    </Form>
  );
};
