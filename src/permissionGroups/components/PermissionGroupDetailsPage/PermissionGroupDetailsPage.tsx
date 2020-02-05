import React from "react";
import { useIntl } from "react-intl";

// import AccountPermissions from "@saleor/components/AccountPermissions";
// import AccountStatus from "@saleor/components/AccountStatus";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
// import useLocale from "@saleor/hooks/useLocale";
import { sectionNames } from "@saleor/intl";
import { maybe } from "../../../misc";
import { PermissionEnum } from "../../../types/globalTypes";
import { PermissionGroupDetails_permissionGroup } from "../../types/PermissionGroupDetails";
// import { ListActions, ListProps, SortPage } from "../../../types";

// import { StaffMemberDetails_user } from "../../types/StaffMemberDetails";
import MembersList from "../MembersList";
// import StaffProperties from "../StaffProperties/StaffProperties";
// import StaffPassword from "../StaffPassword/StaffPassword";

interface FormData {
  hasFullAccess: boolean;
  permissions: PermissionEnum[];
  name: string;
}

export interface PermissionGroupDetailsPageProps {
  canEditPreferences: boolean;
  canEditStatus: boolean;
  disabled: boolean;
  canRemove: boolean;
  permissions: ShopInfo_shop_permissions[];
  saveButtonBarState: ConfirmButtonTransitionState;
  permissionGroup: PermissionGroupDetails_permissionGroup;
  onBack: () => void;
  onDelete: () => void;
  onSubmit: (data: FormData) => void;
}

const PermissionGroupDetailsPage: React.FC<PermissionGroupDetailsPageProps> = ({
  canEditPreferences,
  canEditStatus,
  canRemove,
  permissions,
  saveButtonBarState,
  permissionGroup,
  onBack,
  onDelete,
  onSubmit,
  disabled
}: PermissionGroupDetailsPageProps) => {
  const intl = useIntl();
  // const { locale, setLocale } = useLocale();

  const initialForm: FormData = {
    name: maybe(() => permissionGroup.name, ""),
    hasFullAccess: maybe(
      () =>
        permissions.filter(
          perm =>
            maybe(() => permissionGroup.permissions, []).filter(
              userPerm => userPerm.code === perm.code
            ).length === 0
        ).length === 0,
      false
    ),
    permissions: maybe(() => permissionGroup.permissions, []).map(
      perm => perm.code
    )
  };

  return (
    <>
      <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
        {({ data, change, hasChanged, submit }) => (
          <Container>
            <AppHeader onBack={onBack}>
              {intl.formatMessage(sectionNames.permissionGroups)}
            </AppHeader>
            <PageHeader title={maybe(() => permissionGroup.name)} />
            <Grid>
              <div>
                {/* <StaffProperties
                data={data}
                disabled={disabled}
                onChange={change}
              /> */}
              </div>
              <div>
                {/* {canEditPreferences && (
                // <StaffPreferences locale={locale} onLocaleChange={setLocale} />
              )} */}
                {canEditStatus && (
                  <>
                    {/* <AccountPermissions
                    data={data}
                    disabled={disabled}
                    permissions={permissions}
                    onChange={change}
                  /> */}
                    <CardSpacer />
                    {/* <AccountStatus
                    data={data}
                    disabled={disabled}
                    label={intl.formatMessage({
                      defaultMessage: "User is active",
                      description: "checkbox label"
                    })}
                    onChange={change}
                  /> */}
                  </>
                )}
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || !hasChanged}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
              onDelete={canRemove ? onDelete : undefined}
            />
          </Container>
        )}
      </Form>
      <MembersList
        members={maybe(() => permissionGroup.users)}
        disabled={false}
        onRowClick={() => undefined}
        onNextPage={() => undefined}
        onPreviousPage={() => undefined}
      />
    </>
  );
};
PermissionGroupDetailsPage.displayName = "PermissionGroupDetailsPage";
export default PermissionGroupDetailsPage;
