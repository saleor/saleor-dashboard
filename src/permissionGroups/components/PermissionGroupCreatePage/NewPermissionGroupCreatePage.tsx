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
import { sectionNames } from "@dashboard/intl";
import { permissionGroupListUrl } from "@dashboard/permissionGroups/urls";
import { getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { NewPermissionData } from "../PermissionGroupDetailsPage";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface NewPermissionGroupCreateFormData {
  name: string;
  hasFullAccess: boolean;
  hasRestrictedChannels: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  channels: string[];
}

const initialForm: NewPermissionGroupCreateFormData = {
  hasFullAccess: false,
  hasRestrictedChannels: false,
  isActive: false,
  name: "",
  permissions: [],
  channels: [],
};

export interface NewPermissionGroupCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: NewPermissionData[];
  channels: ChannelFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: NewPermissionGroupCreateFormData) => SubmitPromise;
}

export const NewPermissionGroupCreatePage: React.FC<
  NewPermissionGroupCreatePageProps
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

  const [channelsDisplayValues, setChannelDisplayValues] = useState<
    MultiAutocompleteChoiceType[]
  >([]);

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
          setChannelDisplayValues,
          channelsDisplayValues,
          channelChoices,
        );

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
                    description="Expand or restrict channels permissions"
                    channelsDisplayValues={channelsDisplayValues}
                    allChannels={channels}
                    selectedChannels={data.channels}
                    onChannelChange={handleChannelChange}
                    onChange={change}
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
