import { ProductAvailabilityStatusLabel } from "@dashboard/components/ChannelsAvailabilityDropdown/ProductAvailabilityStatusLabel";
import { Pill } from "@dashboard/components/Pill";
import { getStaffMemberStatusDisplay } from "@dashboard/staff/staffMemberStatus";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";

const messages = defineMessages({
  me: {
    id: "MkPAWX",
    defaultMessage: "Me",
    description: "pill on staff details when viewing your own profile",
  },
});

interface StaffDetailsTitleProps {
  name: string | null | undefined;
  isActive: boolean;
  invitePending: boolean;
  /** Viewing the signed-in user’s own staff profile. */
  isCurrentUser?: boolean;
}

export const StaffDetailsTitle = ({
  name,
  isActive,
  invitePending,
  isCurrentUser = false,
}: StaffDetailsTitleProps): ReactNode => {
  const intl = useIntl();
  const statusDisplay = getStaffMemberStatusDisplay({
    isActive,
    invitePending,
    intl,
  });

  return (
    <Box
      display="flex"
      alignItems="baseline"
      gap={2}
      flexWrap="nowrap"
      paddingRight={3}
      __minWidth="0"
    >
      <Box
        title={name ?? undefined}
        __maxWidth="320px"
        __overflow="hidden"
        __textOverflow="ellipsis"
        __whiteSpace="nowrap"
        __minWidth="0"
      >
        {name}
      </Box>
      {isCurrentUser ? (
        <Pill
          data-test-id="staff-member-me"
          label={intl.formatMessage(messages.me)}
          color="neutral"
        />
      ) : null}
      <Box data-test-id="staff-member-status" flexShrink="0">
        <ProductAvailabilityStatusLabel
          label={statusDisplay.label}
          status={statusDisplay.dot}
          ellipsis={false}
        />
      </Box>
    </Box>
  );
};
