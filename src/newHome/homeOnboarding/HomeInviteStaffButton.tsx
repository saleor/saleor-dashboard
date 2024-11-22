import { useUser } from "@dashboard/auth";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { staffListPath } from "@dashboard/staff/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeInviteStaffButton = () => {
  const { user } = useUser();
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageStaff = hasPermissions(userPermissions, [PermissionEnum.MANAGE_STAFF]);

  if (!hasPermissionToManageStaff) {
    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton variant="primary">
            <FormattedMessage defaultMessage="Invite members" id="BBt3jD" description="btn label" />
          </HomeFakeDisabledButton>
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

  const inviteTeamMembersPath = staffListPath;

  return (
    <Link to={inviteTeamMembersPath}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Invite members" id="BBt3jD" description="btn label" />
      </Button>
    </Link>
  );
};
