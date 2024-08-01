// @ts-strict-ignore
import photoIcon from "@assets/images/photo-icon.svg";
import { DashboardCard } from "@dashboard/components/Card";
import { StaffErrorFragment, StaffMemberDetailsFragment, UserFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getUserInitials } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getStaffErrorMessage from "@dashboard/utils/errors/staff";
import { TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

interface StaffPropertiesProps {
  canEditAvatar: boolean;
  className?: string;
  data: {
    email: string;
    firstName: string;
    lastName: string;
  };
  errors: StaffErrorFragment[];
  disabled: boolean;
  staffMember: StaffMemberDetailsFragment | UserFragment;
  onChange: (event: React.ChangeEvent<any>) => void;
  onImageDelete: () => void;
  onImageUpload: (file: File) => void;
}

const StaffProperties: React.FC<StaffPropertiesProps> = props => {
  const {
    canEditAvatar,
    className,
    data,
    errors,
    staffMember,
    onChange,
    onImageDelete,
    onImageUpload,
  } = props;
  const intl = useIntl();
  const imgInputAnchor = React.createRef<HTMLInputElement>();
  const clickImgInput = () => imgInputAnchor.current.click();
  const formErrors = getFormErrors(["id", "firstName", "lastName", "email"], errors || []);
  const hasAvatar = !!staffMember?.avatar?.url;
  const getFieldProps = (name: string) => ({
    disabled: props.disabled,
    error: !!formErrors[name],
    helperText: formErrors[name]?.message,
    label: intl.formatMessage(commonMessages[name]),
    name,
    value: data[name],
  });

  return (
    <DashboardCard className={className} data-test-id="staff-member-information">
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage({
            id: "VTITVe",
            defaultMessage: "Staff Member Information",
            description: "section header",
          })}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
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
              {hasAvatar ? (
                <Box as="img" pointerEvents="none" width="100%" src={staffMember.avatar.url} />
              ) : (
                <Box
                  backgroundColor="accent1"
                  __height="120px"
                  __width="120px"
                  display="flex"
                  justifyContent="center"
                >
                  <Text
                    color="buttonDefaultPrimary"
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
                    <>
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
                    </>
                  )}
                  <input
                    style={{ display: "none" }}
                    id="fileUpload"
                    onChange={event => onImageUpload(event.target.files[0])}
                    type="file"
                    ref={imgInputAnchor}
                  />
                </Box>
              )}
            </Box>
          </div>
          <div>
            <Box
              display="grid"
              gap={4}
              gridTemplateColumns={{
                mobile: 1,
                tablet: 2,
              }}
            >
              <Box>
                <TextField
                  {...getFieldProps("firstName")}
                  onChange={onChange}
                  fullWidth
                  inputProps={{
                    spellCheck: false,
                    "data-test-id": "staffFirstName",
                  }}
                />
              </Box>
              <Box>
                <TextField
                  {...getFieldProps("lastName")}
                  onChange={onChange}
                  fullWidth
                  inputProps={{
                    spellCheck: false,
                    "data-test-id": "staffLastName",
                  }}
                />
              </Box>
              <Box>
                <TextField
                  {...getFieldProps("email")}
                  onChange={onChange}
                  fullWidth
                  inputProps={{
                    spellCheck: false,
                    "data-test-id": "staffEmail",
                  }}
                />
              </Box>
            </Box>
          </div>
        </Box>
      </DashboardCard.Content>
      {!!formErrors.id && (
        <DashboardCard.Content>
          <Text color="critical1">{getStaffErrorMessage(formErrors.id, intl)}</Text>
        </DashboardCard.Content>
      )}
    </DashboardCard>
  );
};

StaffProperties.displayName = "StaffProperties";
export default StaffProperties;
