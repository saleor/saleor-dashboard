// @ts-strict-ignore
import AccountPermissionGroups from "@dashboard/components/AccountPermissionGroups";
import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import Form, { FormDirtyStateSync } from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import {
  type SearchPermissionGroupsQuery,
  type StaffErrorFragment,
  type StaffMemberDetailsFragment,
  type UserFragment,
} from "@dashboard/graphql";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useLocale from "@dashboard/hooks/useLocale";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getUserName } from "@dashboard/misc";
import { StaffStatus } from "@dashboard/staff/components/StaffStatus/StaffStatus";
import { isStaffInvitePending } from "@dashboard/staff/staffMemberStatus";
import { staffListPath } from "@dashboard/staff/urls";
import { getMemberPermissionGroups, isMemberActive } from "@dashboard/staff/utils";
import { type FetchMoreProps, type RelayToFlat, type SearchPageProps } from "@dashboard/types";
import { Box, Button, type Option, Text } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { StaffPreferences } from "../StaffPreferences/StaffPreferences";
import { StaffProperties } from "../StaffProperties/StaffProperties";
import { isStaffDetailsFormPristine } from "./isStaffDetailsFormPristine";
import { StaffDetailsTitle } from "./StaffDetailsTitle";

export interface StaffDetailsFormData {
  email: string;
  firstName: string;
  lastName: string;
  permissionGroups: Option[];
}

interface StaffDetailsPageProps extends SearchPageProps {
  availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]>;
  canEditAvatar: boolean;
  canEditPreferences: boolean;
  canEditEmail: boolean;
  canEditStatus: boolean;
  canRemove: boolean;
  canViewCustomerProfile: boolean;
  disabled: boolean;
  disabledStatus?: boolean;
  fetchMorePermissionGroups: FetchMoreProps;
  saveButtonBarState: ConfirmButtonTransitionState;
  staffMember: StaffMemberDetailsFragment | UserFragment | undefined;
  errors: StaffErrorFragment[];
  onResetPassword: () => void;
  onDelete: () => void;
  onImageDelete: () => void;
  onToggleStaffStatus?: () => void;
  onResendInvite?: () => void;
  onShowMetadata?: () => void;
  onViewCustomerProfile: () => void;
  onSubmit: (data: StaffDetailsFormData) => SubmitPromise;
  onImageUpload: (file: File) => any;
}

export const StaffDetailsPage: React.FC<StaffDetailsPageProps> = ({
  availablePermissionGroups,
  canEditAvatar,
  canEditPreferences,
  canEditEmail,
  canEditStatus,
  canRemove,
  canViewCustomerProfile,
  disabled,
  disabledStatus,
  errors,
  fetchMorePermissionGroups,
  initialSearch,
  onResetPassword,
  onDelete,
  onImageDelete,
  onImageUpload,
  onSearchChange,
  onSubmit,
  onToggleStaffStatus,
  onResendInvite,
  onShowMetadata,
  onViewCustomerProfile,
  saveButtonBarState,
  staffMember,
}: StaffDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { locale, setLocale } = useLocale();
  const isActive = isMemberActive(staffMember);
  const invitePending = isStaffInvitePending(staffMember);
  const permissionGroups = getMemberPermissionGroups(staffMember);
  const staffMemberName = getUserName(staffMember);
  const showRightSidebar = canEditPreferences || canEditStatus;

  const staffListBackLink = useBackLinkWithState({
    path: staffListPath,
  });

  const initialForm: StaffDetailsFormData = useMemo(
    () => ({
      email: staffMember?.email || "",
      firstName: staffMember?.firstName || "",
      lastName: staffMember?.lastName || "",
      permissionGroups: (permissionGroups ?? []).map(pg => ({ label: pg.name, value: pg.id })),
    }),
    [staffMember, permissionGroups],
  );
  const checkIfSaveIsDisabled = useCallback(
    (data: StaffDetailsFormData) => {
      if (disabled || !staffMember) {
        return true;
      }

      return isStaffDetailsFormPristine(data, initialForm);
    },
    [disabled, initialForm, staffMember],
  );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
      checkIfSaveIsDisabled={checkIfSaveIsDisabled}
    >
      {({ data: formData, change, isSaveDisabled, submit, triggerChange }) => {
        return (
          <>
            <FormDirtyStateSync
              enabled={!!staffMember}
              isSaveDisabled={isSaveDisabled}
              triggerChange={triggerChange}
            />
            <DetailPageLayout gridTemplateColumns={showRightSidebar ? 12 : 1}>
              <TopNav
                href={staffListBackLink}
                hrefIcon={<TopNavDestinationIcon.staff />}
                hrefTitle={intl.formatMessage(topNavDestinationMessages.allStaffMembers)}
                title={
                  staffMember ? (
                    <StaffDetailsTitle
                      name={staffMemberName}
                      isActive={isActive}
                      invitePending={invitePending}
                      isCurrentUser={canEditPreferences}
                    />
                  ) : null
                }
                actionsGap={3}
              >
                {onShowMetadata ? (
                  <TopNav.MetadataButton
                    onClick={onShowMetadata}
                    disabled={!staffMember}
                    data-test-id="show-staff-member-metadata"
                    title={intl.formatMessage({
                      defaultMessage: "Edit staff member metadata",
                      description: "staff detail page, top-bar metadata button tooltip",
                      id: "mLeZoR",
                    })}
                  />
                ) : null}
                {canEditStatus && invitePending && onResendInvite ? (
                  <Button
                    onClick={onResendInvite}
                    data-test-id="resend-invite-button"
                    variant="secondary"
                    alignSelf="center"
                    disabled={disabled}
                  >
                    {intl.formatMessage({
                      id: "n9bERs",
                      defaultMessage: "Resend invitation",
                      description: "staff details top nav CTA for pending invite",
                    })}
                  </Button>
                ) : null}
                {canEditStatus && staffMember && onToggleStaffStatus ? (
                  <StaffStatus
                    isActive={isActive}
                    disabled={disabled || !!disabledStatus}
                    onClick={onToggleStaffStatus}
                  />
                ) : null}
                {canViewCustomerProfile && staffMember?.id && (
                  <Button
                    onClick={onViewCustomerProfile}
                    data-test-id="viewCustomerProfileBtn"
                    variant="secondary"
                    alignSelf="center"
                    disabled={disabled}
                  >
                    {intl.formatMessage({
                      defaultMessage: "View customer profile",
                      id: "6Wr3aF",
                    })}
                  </Button>
                )}
                {canEditPreferences && (
                  <Button
                    onClick={onResetPassword}
                    data-test-id="resetPasswordBtn"
                    variant="secondary"
                    alignSelf="center"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Reset password",
                      id: "Yy/yDL",
                    })}
                  </Button>
                )}
              </TopNav>
              <DetailPageLayout.Content>
                <DetailPageContent>
                  <StaffProperties
                    errors={errors}
                    data={formData}
                    disabled={disabled}
                    canEditAvatar={canEditAvatar}
                    canEditEmail={canEditEmail}
                    staffMember={staffMember}
                    onChange={change}
                    onImageUpload={onImageUpload}
                    onImageDelete={onImageDelete}
                  />
                </DetailPageContent>
              </DetailPageLayout.Content>

              {showRightSidebar ? (
                <DetailPageLayout.RightSidebar paddingTop={6}>
                  <Box display="flex" flexDirection="column" gap={4} paddingX={6}>
                    {canEditPreferences && (
                      <StaffPreferences locale={locale} onLocaleChange={setLocale} />
                    )}
                    {canEditStatus && (
                      <DetailSettingsCard
                        data-test-id="staff-permissions"
                        title={intl.formatMessage({
                          id: "Fbr4Vp",
                          defaultMessage: "Permissions",
                          description: "dialog header",
                        })}
                        intro={
                          <Text size={3} color="default2">
                            {intl.formatMessage({
                              id: "P+kVxW",
                              defaultMessage: "User is assigned to:",
                              description: "card description",
                            })}
                          </Text>
                        }
                      >
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
                      </DetailSettingsCard>
                    )}
                  </Box>
                </DetailPageLayout.RightSidebar>
              ) : null}
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
          </>
        );
      }}
    </Form>
  );
};
