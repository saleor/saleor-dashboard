import photoIcon from "@assets/images/photo-icon.svg";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { FixedAtCreationField } from "@dashboard/components/FixedAtCreationField/FixedAtCreationField";
import {
  type StaffErrorFragment,
  type StaffMemberDetailsFragment,
  type UserFragment,
} from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getUserInitials } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getStaffErrorMessage from "@dashboard/utils/errors/staff";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { type ChangeEvent, createRef } from "react";
import SVG from "react-inlinesvg";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";

const messages = defineMessages({
  myProfile: {
    id: "zdyqBq",
    defaultMessage: "My profile",
    description: "account settings profile card title when viewing yourself",
  },
  profile: {
    id: "Mwk9vC",
    defaultMessage: "Profile",
    description: "staff details profile card title when viewing another staff member",
  },
  emailHintLocked: {
    id: "gcrgGO",
    defaultMessage: "Only a staff administrator can change your email.",
    description: "helper under locked email when the signed-in user cannot manage staff",
  },
  emailHintEditable: {
    id: "pkzlgy",
    defaultMessage: "Used to sign in. The change takes effect as soon as you save.",
    description: "helper under editable staff email — login identity, no confirmation step",
  },
});

interface StaffPropertiesProps {
  canEditAvatar: boolean;
  canEditEmail: boolean;
  /** Viewing the signed-in user’s own staff profile. */
  isCurrentUser: boolean;
  data: {
    email: string;
    firstName: string;
    lastName: string;
  };
  errors: StaffErrorFragment[];
  disabled: boolean;
  staffMember: StaffMemberDetailsFragment | UserFragment | undefined;
  onChange: (event: ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

export const StaffProperties = ({
  canEditAvatar,
  canEditEmail,
  isCurrentUser,
  data,
  errors,
  disabled,
  staffMember,
  onChange,
  onImageDelete,
  onImageUpload,
}: StaffPropertiesProps): JSX.Element => {
  const intl = useIntl();
  const imgInputAnchor = createRef<HTMLInputElement>();
  const clickImgInput = (): void => {
    imgInputAnchor.current?.click();
  };
  const formErrors = getFormErrors(["id", "firstName", "lastName", "email"], errors || []);
  const avatarUrl = staffMember?.avatar?.url;
  const hasAvatar = !!avatarUrl;

  return (
    <DetailSettingsCard
      data-test-id="staff-member-information"
      title={intl.formatMessage(isCurrentUser ? messages.myProfile : messages.profile)}
    >
      <Box display="grid" gap={6} __gridTemplateColumns="120px 1fr">
        <div>
          <Box
            alignItems="center"
            borderRadius="100%"
            display="grid"
            justifyContent="center"
            overflow="hidden"
            position="relative"
            __height="120px"
            __width="120px"
          >
            {hasAvatar && avatarUrl ? (
              <Box as="img" pointerEvents="none" width="100%" src={avatarUrl} />
            ) : (
              <Box
                backgroundColor="default3"
                __height="120px"
                __width="120px"
                display="flex"
                justifyContent="center"
              >
                <Text
                  color="default1"
                  fontWeight="bold"
                  textAlign="center"
                  __fontSize={35}
                  __lineHeight="120px"
                >
                  {getUserInitials(data)}
                </Text>
              </Box>
            )}
            {canEditAvatar && (
              <Box
                borderRadius="100%"
                opacity={{
                  hover: "1",
                  default: "0",
                }}
                position="absolute"
                padding={4}
                __height="120px"
                __backgroundColor="#00000080"
                __width="120px"
                __transition="opacity 0.5s"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
              >
                <SVG src={photoIcon} />
                <Text
                  onClick={clickImgInput}
                  textDecoration={{
                    hover: "underline",
                  }}
                  color="buttonDefaultPrimary"
                  cursor="pointer"
                  fontSize={4}
                >
                  <FormattedMessage
                    id="+2VzH4"
                    defaultMessage="Change"
                    description="avatar change button"
                  />
                </Text>
                {hasAvatar && (
                  <Text
                    onClick={onImageDelete}
                    textDecoration={{
                      hover: "underline",
                    }}
                    color="buttonDefaultPrimary"
                    cursor="pointer"
                    fontSize={4}
                  >
                    <FormattedMessage
                      id="11lR5V"
                      defaultMessage="Delete"
                      description="avatar delete button"
                    />
                  </Text>
                )}
                <input
                  style={{ display: "none" }}
                  id="fileUpload"
                  onChange={event => {
                    const file = event.target.files?.[0];

                    if (file) {
                      onImageUpload(file);
                    }
                  }}
                  type="file"
                  ref={imgInputAnchor}
                />
              </Box>
            )}
          </Box>
        </div>
        <Box
          display="grid"
          gap={4}
          gridTemplateColumns={{
            mobile: 1,
            tablet: 2,
          }}
        >
          <Input
            size="small"
            disabled={disabled}
            error={!!formErrors.firstName}
            helperText={
              formErrors.firstName ? getStaffErrorMessage(formErrors.firstName, intl) : undefined
            }
            label={intl.formatMessage(commonMessages.firstName)}
            name="firstName"
            value={data.firstName}
            onChange={onChange}
            data-test-id="staffFirstName"
          />
          <Input
            size="small"
            disabled={disabled}
            error={!!formErrors.lastName}
            helperText={
              formErrors.lastName ? getStaffErrorMessage(formErrors.lastName, intl) : undefined
            }
            label={intl.formatMessage(commonMessages.lastName)}
            name="lastName"
            value={data.lastName}
            onChange={onChange}
            data-test-id="staffLastName"
          />
          <Box __gridColumn="1 / -1" width="100%">
            {canEditEmail ? (
              <Input
                size="small"
                disabled={disabled}
                error={!!formErrors.email}
                helperText={
                  formErrors.email
                    ? getStaffErrorMessage(formErrors.email, intl)
                    : intl.formatMessage(messages.emailHintEditable)
                }
                label={intl.formatMessage(commonMessages.email)}
                name="email"
                value={data.email}
                onChange={onChange}
                data-test-id="staffEmail"
              />
            ) : (
              <FixedAtCreationField
                data-test-id="staffEmail"
                helperText={intl.formatMessage(messages.emailHintLocked)}
                label={intl.formatMessage(commonMessages.email)}
                name="email"
                value={data.email}
              />
            )}
          </Box>
        </Box>
      </Box>
      {!!formErrors.id && (
        <Text color="critical1" marginTop={4}>
          {getStaffErrorMessage(formErrors.id, intl)}
        </Text>
      )}
    </DetailSettingsCard>
  );
};
