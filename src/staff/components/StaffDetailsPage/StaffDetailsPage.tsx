// @ts-strict-ignore
import AccountPermissionGroups from "@dashboard/components/AccountPermissionGroups";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  SearchPermissionGroupsQuery,
  StaffErrorFragment,
  StaffMemberDetailsFragment,
  UserFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getUserName } from "@dashboard/misc";
import UserStatus from "@dashboard/staff/components/UserStatus";
import { staffListPath } from "@dashboard/staff/urls";
import { getMemberPermissionGroups, isMemberActive } from "@dashboard/staff/utils";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import { Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import StaffPassword from "../StaffPassword/StaffPassword";
import StaffPreferences from "../StaffPreferences";
import StaffProperties from "../StaffProperties/StaffProperties";
import { staffDetailsPageMessages as messages } from "./messages";

export interface StaffDetailsFormData {
  email: string;
  firstName: string;
  isActive: boolean;
  lastName: string;
  permissionGroups: Option[];
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
  onImageUpload: (file: File) => any;
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
  const navigate = useNavigator();
  const { locale, setLocale } = useLocale();
  const isActive = isMemberActive(staffMember);
  const permissionGroups = getMemberPermissionGroups(staffMember);

  const staffListBackLink = useBackLinkWithState({
    path: staffListPath,
  });

  const initialForm: StaffDetailsFormData = {
    email: staffMember?.email || "",
    firstName: staffMember?.firstName || "",
    isActive,
    lastName: staffMember?.lastName || "",
    permissionGroups: permissionGroups.map(pg => ({ label: pg.name, value: pg.id })),
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ data: formData, change, isSaveDisabled, submit }) => {
        return (
          <DetailPageLayout>
            <TopNav href={staffListBackLink} title={getUserName(staffMember)} />
            <DetailPageLayout.Content>
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
            </DetailPageLayout.Content>

            <DetailPageLayout.RightSidebar>
              {canEditPreferences && (
                <StaffPreferences locale={locale} onLocaleChange={setLocale} />
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
                  <DashboardCard>
                    <DashboardCard.Header>
                      <DashboardCard.Title>
                        {intl.formatMessage({
                          id: "Fbr4Vp",
                          defaultMessage: "Permissions",
                          description: "dialog header",
                        })}
                      </DashboardCard.Title>
                    </DashboardCard.Header>
                    <DashboardCard.Content>
                      <Text marginBottom={1}>
                        {intl.formatMessage({
                          id: "P+kVxW",
                          defaultMessage: "User is assigned to:",
                          description: "card description",
                        })}
                      </Text>

                      <AccountPermissionGroups
                        formData={formData}
                        disabled={disabled}
                        errors={errors}
                        initialSearch={initialSearch}
                        availablePermissionGroups={availablePermissionGroups}
                        onChange={change}
                        onSearchChange={onSearchChange}
                        {...fetchMorePermissionGroups}
                      />
                    </DashboardCard.Content>
                  </DashboardCard>
                </>
              )}
            </DetailPageLayout.RightSidebar>
            <Savebar>
              {canRemove && <Savebar.DeleteButton onClick={onDelete} />}
              <Savebar.Spacer />
              <Savebar.CancelButton onClick={() => navigate(staffListBackLink)} />
              <Savebar.ConfirmButton
                transitionState={saveButtonBarState}
                onClick={submit}
                disabled={isSaveDisabled}
              />
            </Savebar>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};

StaffDetailsPage.displayName = "StaffDetailsPage";
export default StaffDetailsPage;
