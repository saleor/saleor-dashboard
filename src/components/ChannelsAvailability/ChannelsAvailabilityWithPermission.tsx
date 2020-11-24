import { hasPermission } from "@saleor/auth/misc";
import ChannelsAvailability, {
  ChannelsAvailabilityProps
} from "@saleor/components/ChannelsAvailability/ChannelsAvailability";
import useUser from "@saleor/hooks/useUser";
import { PermissionEnum } from "@saleor/types/globalTypes";
import React from "react";

export const ChannelsAvailabilityWithPermission: React.FC<Omit<
  ChannelsAvailabilityProps,
  "hasManageChannelPermission"
>> = props => {
  const { user } = useUser();
  const hasManageChannelPermission =
    !!user && hasPermission(PermissionEnum.MANAGE_CHANNELS, user);

  return (
    <ChannelsAvailability
      {...props}
      hasManageChannelPermission={hasManageChannelPermission}
    />
  );
};

export default ChannelsAvailabilityWithPermission;
