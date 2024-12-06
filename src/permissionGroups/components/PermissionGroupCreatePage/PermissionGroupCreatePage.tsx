import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { ChannelPermission } from "@dashboard/components/ChannelPermission";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { ChannelFragment, PermissionEnum, PermissionGroupErrorFragment } from "@dashboard/graphql";
import { FormChange, SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { buttonMessages, sectionNames } from "@dashboard/intl";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionData } from "../PermissionGroupDetailsPage";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreateFormData {
  name: string;
  hasFullAccess: boolean;
  hasAllChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  channels: string[];
}

const initialForm: PermissionGroupCreateFormData = {
  hasFullAccess: false,
  hasAllChannels: true,
  isActive: false,
  name: "",
  permissions: [],
  channels: [],
};

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionData[];
  channels: ChannelFragment[];
  hasRestrictedChannels: boolean;
  saveButtonBarState: "loading" | "success" | "error" | "default";
  onSubmit: (data: PermissionGroupCreateFormData) => SubmitPromise;
}

export const PermissionGroupCreatePage = ({
  disabled,
  permissions,
  channels,
  onSubmit,
  saveButtonBarState,
  hasRestrictedChannels,
  errors,
}: PermissionGroupCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const formErrors = getFormErrors(["addPermissions"], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

  return (
    <Form
      confirmLeave
      initial={{
        ...initialForm,
        hasAllChannels: !hasRestrictedChannels,
      }}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => {
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

              <FormSpacer />

              <Box paddingX={6}>
                <ChannelPermission
                  allChannels={channels}
                  selectedChannels={data.channels}
                  onChannelChange={handleChannelChange}
                  onHasAllChannelsChange={handleHasAllChannelsChange}
                  hasAllChannels={data.hasAllChannels}
                  disabled={false}
                  disabledSelectAllChannels={hasRestrictedChannels}
                />
              </Box>
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              <AccountPermissions
                permissionsExceeded={false}
                data={data}
                errorMessage={permissionsError}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                fullAccessLabel={intl.formatMessage(buttonMessages.selectAll)}
                description={intl.formatMessage({
                  id: "CYZse9",
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description",
                })}
              />
            </DetailPageLayout.RightSidebar>
            <Savebar>
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(permissionGroupListUrl())} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={!!isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
