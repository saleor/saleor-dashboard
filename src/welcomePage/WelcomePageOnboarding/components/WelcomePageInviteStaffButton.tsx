import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { staffListUrl } from "@dashboard/staff/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { PrimaryActionProps } from "./type";
import { WelcomePageFakeDisabledButton } from "./WelcomePageFakeDisabledButton";

export const WelcomePageInviteStaffButton = ({ onClick }: PrimaryActionProps) => {
  const { user } = useUser();
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
    <Link to={staffListUrl({ action: "add" })} onClick={onClick}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Invite members" id="BBt3jD" description="btn label" />
      </Button>
    </Link>
  );
};
