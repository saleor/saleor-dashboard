import AccountPermissions from '@dashboard/components/AccountPermissions';
import { Content } from '@dashboard/components/AppLayout/Content';
import { DetailedContent } from '@dashboard/components/AppLayout/DetailedContent';
import { RightSidebar } from '@dashboard/components/AppLayout/RightSidebar';
import { Backlink } from '@dashboard/components/Backlink';
import Form from '@dashboard/components/Form';
import Savebar from '@dashboard/components/Savebar';
import { PermissionEnum, PermissionGroupErrorFragment } from '@dashboard/graphql';
import { SubmitPromise } from '@dashboard/hooks/useForm';
import useNavigator from '@dashboard/hooks/useNavigator';
import { sectionNames } from '@dashboard/intl';
import { permissionGroupListUrl } from '@dashboard/permissionGroups/urls';
import { getFormErrors } from '@dashboard/utils/errors';
import getPermissionGroupErrorMessage from '@dashboard/utils/errors/permissionGroups';
import { ConfirmButtonTransitionState } from '@saleor/macaw-ui';
import React from 'react';
import { useIntl } from 'react-intl';

import { PermissionData } from '../PermissionGroupDetailsPage';
import PermissionGroupInfo from '../PermissionGroupInfo';

export interface PermissionGroupCreateFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreateFormData = {
  hasFullAccess: false,
  isActive: false,
  name: '',
  permissions: [],
};

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionData[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (data: PermissionGroupCreateFormData) => SubmitPromise;
}

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled,
  permissions,
  onSubmit,
  saveButtonBarState,
  errors,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const formErrors = getFormErrors(['addPermissions'], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(formErrors.addPermissions, intl);

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, submit, isSaveDisabled }) => (
        <DetailedContent>
          <Content>
            <Backlink href={permissionGroupListUrl()}>{intl.formatMessage(sectionNames.permissionGroups)}</Backlink>
            <PermissionGroupInfo data={data} errors={errors} onChange={change} disabled={disabled} />
          </Content>
          <RightSidebar>
            <AccountPermissions
              permissionsExceeded={false}
              data={data}
              errorMessage={permissionsError}
              disabled={disabled}
              permissions={permissions}
              onChange={change}
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
              disabled={isSaveDisabled}
            />
          </div>
        </DetailedContent>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = 'PermissionGroupCreatePage';
export default PermissionGroupCreatePage;
