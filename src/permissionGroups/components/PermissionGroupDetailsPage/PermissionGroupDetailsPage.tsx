import React from "react";
import { useIntl } from "react-intl";

import FormSpacer from "@saleor/components/FormSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { UserError, ListActions, SortPage } from "@saleor/types";
import AccountPermissions from "@saleor/components/AccountPermissions";
import AppHeader from "@saleor/components/AppHeader";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import {
  isGroupFullAccess,
  extractPermissionCodes
} from "@saleor/permissionGroups/utils";
import { MembersListUrlSortField } from "@saleor/permissionGroups/urls";
import PermissionGroupInfo from "../PermissionGroupInfo";
import {
  PermissionGroupDetails_permissionGroup,
  PermissionGroupDetails_permissionGroup_users
} from "../../types/PermissionGroupDetails";
import PermissionGroupMemberList from "../PermissionGroupMemberList";

export interface PermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetails_permissionGroup_users[];
}

export interface PermissionGroupDetailsPageProps
  extends ListActions,
    SortPage<MembersListUrlSortField> {
  errors: UserError[];
  permissionGroup: PermissionGroupDetails_permissionGroup;
  members: PermissionGroupDetails_permissionGroup_users[];
  membersModified: boolean;
  permissions: ShopInfo_shop_permissions[];
  saveButtonBarState: ConfirmButtonTransitionState;
  disabled: boolean;

  onAssign: () => void;
  onBack: () => void;
  onUnassign: (ids: string[]) => void;
  onSubmit(data: PermissionGroupDetailsPageFormData);
}

const PermissionGroupDetailsPage: React.FC<PermissionGroupDetailsPageProps> = ({
  permissionGroup,
  permissions,
  disabled,
  onBack,
  saveButtonBarState,
  errors,
  onSubmit,
  members,
  membersModified,
  ...listProps
}) => {
  const intl = useIntl();

  const initialForm: PermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    isActive: false,
    name: permissionGroup?.name ? permissionGroup.name : "",
    permissions: extractPermissionCodes(permissionGroup),
    users: members
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
      {({ data, change, submit, hasChanged }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.permissionGroups)}
          </AppHeader>
          <PageHeader
            title={permissionGroup ? permissionGroup.name : undefined}
          />

          <Grid>
            <div>
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
                users={data?.users}
              />
            </div>
            <div>
              <AccountPermissions
                data={data}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                errors={errors}
                fullAccessLabel={intl.formatMessage({
                  defaultMessage: "Group has full access to the store",
                  description: "checkbox label"
                })}
                description={intl.formatMessage({
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description"
                })}
              />
            </div>
          </Grid>
          <div>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !(hasChanged || membersModified)}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
PermissionGroupDetailsPage.displayName = "PermissionGroupDetailsPage";
export default PermissionGroupDetailsPage;
