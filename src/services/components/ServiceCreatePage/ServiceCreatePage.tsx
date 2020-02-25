import React from "react";
import { useIntl } from "react-intl";

import AccountPermissions from "@saleor/components/AccountPermissions";
import AccountStatus from "@saleor/components/AccountStatus";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { sectionNames } from "@saleor/intl";
import { UserError } from "@saleor/types";
import { PermissionEnum } from "@saleor/types/globalTypes";
import ServiceInfo from "../ServiceInfo";

export interface ServiceCreatePageFormData {
  hasFullAccess: boolean;
  isActive: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface ServiceCreatePageProps {
  disabled: boolean;
  errors: UserError[];
  permissions: ShopInfo_shop_permissions[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: ServiceCreatePageFormData) => void;
}

const ServiceCreatePage: React.FC<ServiceCreatePageProps> = props => {
  const {
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    onBack,
    onSubmit
  } = props;
  const intl = useIntl();

  const initialForm: ServiceCreatePageFormData = {
    hasFullAccess: false,
    isActive: false,
    name: "",
    permissions: []
  };
  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
      {({ data, change, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.serviceAccounts)}
          </AppHeader>
          <PageHeader
            title={intl.formatMessage({
              defaultMessage: "Create New Account",
              description: "header"
            })}
          />
          <Grid>
            <div>
              <ServiceInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
            </div>
            <AccountPermissions
              data={data}
              disabled={disabled}
              permissions={permissions}
              onChange={change}
            />
            <CardSpacer />
            <AccountStatus
              data={data}
              disabled={disabled}
              label={intl.formatMessage({
                defaultMessage: "Service account is active",
                description: "checkbox label"
              })}
              onChange={change}
            />
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
            onCancel={onBack}
            onSave={submit}
          />
        </Container>
      )}
    </Form>
  );
};

ServiceCreatePage.displayName = "ServiceCreatePage";
export default ServiceCreatePage;
