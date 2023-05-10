import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import Savebar from "@dashboard/components/Savebar";
import {
  ChannelFragment,
  PermissionEnum,
  PermissionGroupErrorFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import PermissionGroupInfo from "../PermissionGroupInfo";
import { PermissionWithChannelsData } from "../PermissonGroupWithChannelsDetailsPage";

export interface PermissionGroupWithChannelsCreateFormData {
  name: string;
  hasFullAccess: boolean;
  hasRestrictedChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  channels: MultiAutocompleteChoiceType[];
}

const initialForm: PermissionGroupWithChannelsCreateFormData = {
  hasFullAccess: false,
  hasRestrictedChannels: false,
  isActive: false,
  name: "",
  permissions: [],
  channels: [],
};

export interface PermissionGroupWithChannelsCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionWithChannelsData[];
  channels: ChannelFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: PermissionGroupWithChannelsCreateFormData) => SubmitPromise;
}

export const PermissionGroupWithChannelsCreatePage: React.FC<
  PermissionGroupWithChannelsCreatePageProps
> = ({
  disabled,
  permissions,
  channels,
  onSubmit,
  saveButtonBarState,
  errors,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const formErrors = getFormErrors(["addPermissions"], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl,
  );

  const channelChoices = mapNodeToChoice(channels);

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled, toggleValue }) => {
        const handleChannelChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          choice => change({ target: { name: "channels", value: choice } }),
          data.channels,
          channelChoices,
        );

        const handleHasRestrictedChannelsChange = () => {
          change({
            target: {
              name: "hasRestrictedChannels",
              value: !data.hasRestrictedChannels,
            },
          });

          // Reset channels when switching between restricted and full access
          change({
            target: {
              name: "channels",
              value: [],
            },
          });
        };

        return (
          <DetailPageLayout>
            <TopNav title="New Permission Group" />
            <DetailPageLayout.Content>
              <Backlink href={permissionGroupListUrl()}>
                {intl.formatMessage(sectionNames.permissionGroups)}
              </Backlink>
              <PermissionGroupInfo
                data={data}
                errors={errors}
                onChange={change}
                disabled={disabled}
              />
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <Box display="flex" flexDirection="column" height="100%">
                <Box overflow="hidden" __maxHeight="50%">
                  <AccountPermissions
                    permissionsExceeded={false}
                    data={data}
                    errorMessage={permissionsError}
                    disabled={disabled}
                    permissions={permissions}
                    onChange={change}
                    fullAccessLabel={intl.formatMessage(
                      buttonMessages.selectAll,
                    )}
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
                    allChannels={channels}
                    selectedChannels={data.channels}
                    onChannelChange={handleChannelChange}
                    onHasRestrictedChannelsChange={
                      handleHasRestrictedChannelsChange
                    }
                    hasRestrictedChannels={data.hasRestrictedChannels}
                    disabled={disabled}
                  />
                </Box>
              </Box>
            </DetailPageLayout.RightSidebar>
            <Savebar
              onCancel={() => navigate(permissionGroupListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
