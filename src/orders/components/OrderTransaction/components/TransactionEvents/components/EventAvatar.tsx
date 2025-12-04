import { UserAvatar } from "@dashboard/components/UserAvatar";
import { AppAvatarFragment, StaffMemberAvatarFragment } from "@dashboard/graphql";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, vars } from "@saleor/macaw-ui-next";
import { LayoutGridIcon, ZapIcon } from "lucide-react";

interface EventAvatarProps {
  createdBy: StaffMemberAvatarFragment | AppAvatarFragment | null;
}

const AVATAR_SIZE = "32px";
const ICON_SIZE = 16;

export const EventAvatar = ({ createdBy }: EventAvatarProps) => {
  if (!createdBy) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="100%"
        borderStyle="solid"
        borderWidth={1}
        borderColor="default1"
        backgroundColor="default1"
        __width={AVATAR_SIZE}
        __height={AVATAR_SIZE}
        flexShrink="0"
        __color={vars.colors.text.default2}
        title="System"
      >
        <ZapIcon size={ICON_SIZE} color="currentColor" />
      </Box>
    );
  }

  if (createdBy.__typename === "App") {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="100%"
        borderStyle="solid"
        borderWidth={1}
        borderColor="default1"
        backgroundColor="default1"
        __width={AVATAR_SIZE}
        __height={AVATAR_SIZE}
        flexShrink="0"
        __color={vars.colors.text.default2}
        title={createdBy.name || "App"}
      >
        <LayoutGridIcon size={ICON_SIZE} color="currentColor" />
      </Box>
    );
  }

  const fullName = getUserName(createdBy, true);

  return (
    <Box
      title={fullName}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink="0"
      __width={AVATAR_SIZE}
      __height={AVATAR_SIZE}
      overflow="hidden"
      borderRadius="100%"
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
    >
      <UserAvatar initials={getUserInitials(createdBy)} url={createdBy?.avatar?.url} />
    </Box>
  );
};
