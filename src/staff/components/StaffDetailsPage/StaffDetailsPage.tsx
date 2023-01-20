import AccountPermissionGroups from "@dashboard/components/AccountPermissionGroups";
import { Backlink } from "@dashboard/components/Backlink";
import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import Container from "@dashboard/components/Container";
import Form from "@dashboard/components/Form";
import Grid from "@dashboard/components/Grid";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import PageHeader from "@dashboard/components/PageHeader";
import Savebar from "@dashboard/components/Savebar";
import {
  SearchPermissionGroupsQuery,
  StaffErrorFragment,
  StaffMemberDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { sectionNames } from "@dashboard/intl";
import { getUserName } from "@dashboard/misc";
import UserStatus from "@dashboard/staff/components/UserStatus";
import { staffListUrl } from "@dashboard/staff/urls";
import {
  getMemberPermissionGroups,
  isMemberActive,
} from "@dashboard/staff/utils";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import createMultiAutocompleteSelectHandler from "@dashboard/utils/handlers/multiAutocompleteSelectChangeHandler";
import { Card, CardContent, Typography } from "@material-ui/core";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
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
  staffMember: StaffMemberDetailsFragment | UserFragment;
  errors: StaffErrorFragment[];
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
  onChangePassword,
  onDelete,
  onImageDelete,
  onImageUpload,
  onSearchChange,
  onSubmit,
  saveButtonBarState,
  staffMember,
}: StaffDetailsPageProps) => {
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();

  const { locale, setLocale } = useLocale();

  const isActive = isMemberActive(staffMember);
  const permissionGroups = getMemberPermissionGroups(staffMember);

  const [
    permissionGroupsDisplayValues,
    setPermissionGroupsDisplayValues,
  ] = useStateFromProps<MultiAutocompleteChoiceType[]>(
    permissionGroups.map(group => ({
      disabled: !group.userCanManage,
      label: group.name,
      value: group.id,
    })) || [],
  );

  const initialForm: StaffDetailsFormData = {
    email: staffMember?.email || "",
    firstName: staffMember?.firstName || "",
    isActive,
    lastName: staffMember?.lastName || "",
    permissionGroups: permissionGroups.map(pg => pg.id),
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
            value: group.id,
          })) || [],
        );

        return (
          <Container>
            <Backlink href={staffListUrl()}>
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
                          id: "Fbr4Vp",
                          defaultMessage: "Permissions",
                          description: "dialog header",
                        })}
                      />
                      <CardContent>
                        <Typography>
                          {intl.formatMessage({
                            id: "P+kVxW",
                            defaultMessage: "User is assigned to:",
                            description: "card description",
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
              onCancel={() => navigate(staffListUrl())}
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
