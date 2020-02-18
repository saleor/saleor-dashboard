import React from "react";
import { useIntl } from "react-intl";

import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { UserError } from "@saleor/types";
import AccountPermissions from "@saleor/components/AccountPermissions";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";

import AppHeader from "@saleor/components/AppHeader";
import { sectionNames } from "@saleor/intl";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreatePageFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreatePageFormData = {
  hasFullAccess: false,
  isActive: false,
  name: "",
  permissions: []
};

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  errors: UserError[];
  permissions: ShopInfo_shop_permissions[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit(data: PermissionGroupCreatePageFormData);
}

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled,
  permissions,
  onBack,
  onSubmit,
  saveButtonBarState,
  errors: userErrors
}) => {
  const intl = useIntl();

  return (
    <Form
      initial={initialForm}
      onSubmit={onSubmit}
      errors={userErrors}
      confirmLeave
    >
      {({ data, change, submit, hasChanged }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.permissionGroups)}
          </AppHeader>
          <Grid>
            <div>
              <PermissionGroupInfo
                data={data}
                onChange={change}
                disabled={disabled}
              />
            </div>
            <div>
              <AccountPermissions
                data={data}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
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
              disabled={disabled || !hasChanged}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
