import { UserAvatar } from "@dashboard/components/UserAvatar";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppAvatarFragment, StaffMemberAvatarFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { Box } from "@saleor/macaw-ui-next";
import { Link } from "react-router-dom";

interface EventCreatedByProps {
  createdBy: StaffMemberAvatarFragment | AppAvatarFragment | null;
}

export const EventCreatedBy = ({ createdBy }: EventCreatedByProps) => {
  if (!createdBy) {
    return null;
  }

  if (createdBy.__typename === "App") {
    return (
      <Link to={ExtensionsUrls.resolveViewManifestExtensionUrl(createdBy.id)}>
        {createdBy.name}
      </Link>
    );
  }

  return (
    <Box
      as={Link}
      // @ts-expect-error - Box inherits props from "Link" but it's not typed
      to={staffMemberDetailsUrl(createdBy.id)}
      display="inline-flex"
      height="100%"
      gap={2}
      alignItems="center"
      justifyContent="flex-end"
    >
      <UserAvatar initials={getUserInitials(createdBy)} url={createdBy?.avatar?.url} />
      {getUserName(createdBy, true)}
    </Box>
  );
};
