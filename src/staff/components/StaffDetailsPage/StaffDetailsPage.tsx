import { Card, CardContent, Typography } from "@material-ui/core";
import AccountPermissionGroups from "@saleor/components/AccountPermissionGroups";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  SearchPermissionGroupsQuery,
  StaffErrorFragment,
  StaffMemberDetailsFragment
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useLocale from "@saleor/hooks/useLocale";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getUserName } from "@saleor/misc";
import UserStatus from "@saleor/staff/components/UserStatus";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@saleor/types";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import React from "react";
import { useIntl } from "react-intl";

import StaffPassword from "../StaffPassword/StaffPassword";
import StaffPreferences from "../StaffPreferences";
import StaffProperties from "../StaffProperties/StaffProperties";
import { staffDetailsPageMessages as messages } from "./messages";
import useStyles from "./styles";

export interface StaffDetailsFormData {
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  permissionGroups: string[];
}

export interface StaffDetailsPageProps extends SearchPageProps {
  availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]>;
  canEditAvatar: boolean;
  canEditPreferences: boolean;
  canEditStatus: boolean;
  canRemove: boolean;
  disabled: boolean;
  fetchMorePermissionGroups: FetchMoreProps;
  saveButtonBarState: ConfirmButtonTransitionState;
  staffMember: StaffMemberDetailsFragment;
  errors: StaffErrorFragment[];
  onBack: () => void;
  onChangePassword: () => void;
  onDelete: () => void;
  onImageDelete: () => void;
  onSubmit: (data: StaffDetailsFormData) => SubmitPromise;
  onImageUpload(file: File);
}

const StaffDetailsPage: React.FC<StaffDetailsPageProps> = ({
  availablePermissionGroups,
  canEditAvatar,
  canEditPreferences,
  canEditStatus,
  canRemove,
  disabled,
  errors,
  fetchMorePermissionGroups,
  initialSearch,
  onBack,
  onChangePassword,
  onDelete,
  onImageDelete,
  onImageUpload,
  onSearchChange,
  onSubmit,
  saveButtonBarState,
  staffMember
}: StaffDetailsPageProps) => {
  const intl = useIntl();
  const classes = useStyles();
  const { locale, setLocale } = useLocale();
  const [
    permissionGroupsDisplayValues,
    setPermissionGroupsDisplayValues
  ] = useStateFromProps<MultiAutocompleteChoiceType[]>(
    (staffMember?.permissionGroups || []).map(group => ({
      disabled: !group.userCanManage,
      label: group.name,
      value: group.id
    })) || []
  );

  const initialForm: StaffDetailsFormData = {
    email: staffMember?.email || "",
    firstName: staffMember?.firstName || "",
    isActive: !!staffMember?.isActive,
    lastName: staffMember?.lastName || "",
    permissionGroups: staffMember?.permissionGroups.map(pg => pg.id) || []
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data: formData, change, isSaveDisabled, submit, toggleValue }) => {
        const permissionGroupsChange = createMultiAutocompleteSelectHandler(
          toggleValue,
          setPermissionGroupsDisplayValues,
          permissionGroupsDisplayValues,
          availablePermissionGroups?.map(group => ({
            label: group.name,
            value: group.id
          })) || []
        );

        return (
          <Container>
            <Backlink onClick={onBack}>
              {intl.formatMessage(sectionNames.staff)}
            </Backlink>
            <PageHeader title={getUserName(staffMember)} />
            <Grid>
              <div>
                <StaffProperties
                  errors={errors}
                  data={formData}
                  disabled={disabled}
                  canEditAvatar={canEditAvatar}
                  staffMember={staffMember}
                  onChange={change}
                  onImageUpload={onImageUpload}
                  onImageDelete={onImageDelete}
                />
                {canEditPreferences && (
                  <>
                    <CardSpacer />
                    <StaffPassword onChangePassword={onChangePassword} />
                  </>
                )}
              </div>
              <div className={classes.noOverflow}>
                {canEditPreferences && (
                  <StaffPreferences
                    locale={locale}
                    onLocaleChange={setLocale}
                  />
                )}
                {canEditStatus && (
                  <>
                    <UserStatus
                      data={formData}
                      disabled={disabled}
                      label={intl.formatMessage(messages.userStatusActive)}
                      onChange={change}
                    />
                    <CardSpacer />
                    <Card>
                      <CardTitle
                        title={intl.formatMessage({
                          defaultMessage: "Permissions",
                          description: "dialog header"
                        })}
                      />
                      <CardContent>
                        <Typography>
                          {intl.formatMessage({
                            defaultMessage: "User is assigned to:",
                            description: "card description"
                          })}
                        </Typography>

                        <AccountPermissionGroups
                          formData={formData}
                          disabled={disabled}
                          errors={errors}
                          initialSearch={initialSearch}
                          availablePermissionGroups={availablePermissionGroups}
                          onChange={permissionGroupsChange}
                          onSearchChange={onSearchChange}
                          displayValues={permissionGroupsDisplayValues}
                          {...fetchMorePermissionGroups}
                        />
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </Grid>
            <Savebar
              disabled={isSaveDisabled}
              state={saveButtonBarState}
              onCancel={onBack}
              onSubmit={submit}
              onDelete={canRemove ? onDelete : undefined}
            />
          </Container>
        );
      }}
    </Form>
  );
};
StaffDetailsPage.displayName = "StaffDetailsPage";
export default StaffDetailsPage;
