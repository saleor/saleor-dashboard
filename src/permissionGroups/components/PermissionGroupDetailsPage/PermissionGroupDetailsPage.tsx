import AccountPermissions from '@dashboard/components/AccountPermissions';
import { Content } from '@dashboard/components/AppLayout/Content';
import { DetailedContent } from '@dashboard/components/AppLayout/DetailedContent';
import { RightSidebar } from '@dashboard/components/AppLayout/RightSidebar';
import { TopNav } from '@dashboard/components/AppLayout/TopNav';
import Form from '@dashboard/components/Form';
import FormSpacer from '@dashboard/components/FormSpacer';
import Savebar from '@dashboard/components/Savebar';
import {
  PermissionEnum,
  PermissionGroupDetailsFragment,
  PermissionGroupErrorFragment,
  UserPermissionFragment,
} from '@dashboard/graphql';
import { SubmitPromise } from '@dashboard/hooks/useForm';
import useNavigator from '@dashboard/hooks/useNavigator';
import { MembersListUrlSortField, permissionGroupListUrl } from '@dashboard/permissionGroups/urls';
import { extractPermissionCodes, isGroupFullAccess } from '@dashboard/permissionGroups/utils';
import { ListActions, SortPage } from '@dashboard/types';
import { getFormErrors } from '@dashboard/utils/errors';
import getPermissionGroupErrorMessage from '@dashboard/utils/errors/permissionGroups';
import { ConfirmButtonTransitionState } from '@saleor/macaw-ui';
import React from 'react';
import { useIntl } from 'react-intl';

import PermissionGroupInfo from '../PermissionGroupInfo';
import PermissionGroupMemberList from '../PermissionGroupMemberList';

export interface PermissionGroupDetailsPageFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
  users: PermissionGroupDetailsFragment['users'];
}

export interface PermissionData extends Omit<UserPermissionFragment, '__typename'> {
  lastSource?: boolean;
  disabled?: boolean;
}

export interface PermissionGroupDetailsPageProps extends ListActions, SortPage<MembersListUrlSortField> {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  members: PermissionGroupDetailsFragment['users'];
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
  ...listProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: PermissionGroupDetailsPageFormData = {
    hasFullAccess: isGroupFullAccess(permissionGroup, permissions),
    isActive: false,
    name: permissionGroup?.name || '',
    permissions: extractPermissionCodes(permissionGroup),
    users: members,
  };

  const formErrors = getFormErrors(['addPermissions'], errors);
  const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit}>
      {({ data, change, submit }) => (
        <DetailedContent>
          <TopNav href={permissionGroupListUrl()} title={permissionGroup?.name} />
          <Content>
            <PermissionGroupInfo data={data} disabled={disabled} errors={errors} onChange={change} />
            <FormSpacer />
            <PermissionGroupMemberList disabled={disabled} {...listProps} users={data?.users || []} />
          </Content>
          <RightSidebar>
            <AccountPermissions
              permissionsExceeded={permissionsExceeded}
              data={data}
              disabled={disabled}
              permissions={permissions}
              onChange={change}
              errorMessage={permissionsError}
              fullAccessLabel={intl.formatMessage({
                id: 'mAabef',
                defaultMessage: 'Group has full access to the store',
                description: 'checkbox label',
              })}
              description={intl.formatMessage({
                id: 'CYZse9',
                defaultMessage: "Expand or restrict group's permissions to access certain part of saleor system.",
                description: 'card description',
              })}
            />
          </RightSidebar>
          <div>
            <Savebar
              onCancel={() => navigate(permissionGroupListUrl())}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={disabled}
            />
          </div>
        </DetailedContent>
      )}
    </Form>
  );
};
PermissionGroupDetailsPage.displayName = 'PermissionGroupDetailsPage';
export default PermissionGroupDetailsPage;
