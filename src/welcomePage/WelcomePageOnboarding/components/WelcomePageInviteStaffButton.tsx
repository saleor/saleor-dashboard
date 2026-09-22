import { useUser } from "@dashboard/auth/useUser";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { useStaffInviteDialog } from "@dashboard/staff/components/StaffInviteProvider/StaffInviteProvider";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { type PrimaryActionProps } from "./type";
import { WelcomePageFakeDisabledButton } from "./WelcomePageFakeDisabledButton";

export const WelcomePageInviteStaffButton = ({ onClick }: PrimaryActionProps) => {
  const { user } = useUser();
  const { openInvite } = useStaffInviteDialog();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageStaff = hasPermissions(userPermissions, [PermissionEnum.MANAGE_STAFF]);

  if (!hasPermissionToManageStaff) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <WelcomePageFakeDisabledButton variant="primary">
            <FormattedMessage defaultMessage="Invite members" id="BBt3jD" description="btn label" />
          </WelcomePageFakeDisabledButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          <FormattedMessage
            defaultMessage="You don't have permission to manage staff"
            id="gt05TH"
            description="tooltip message"
          />
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return (
    <Button
      data-test-id="onboarding-invite-staff-member"
      variant="primary"
      onClick={() => {
        onClick();
        openInvite();
      }}
    >
      <FormattedMessage defaultMessage="Invite members" id="BBt3jD" description="btn label" />
    </Button>
  );
};
