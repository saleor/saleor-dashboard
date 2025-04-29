import { DashboardCard } from "@dashboard/components/Card";
import { sectionNames } from "@dashboard/intl";
import React from "react";
import { useIntl } from "react-intl";

import PluginDetailsChannelsCardContent, {
  PluginDetailsChannelsCardProps,
} from "./PluginDetailsChannelsCardContent";

const PluginDetailsChannelsCard: React.FC<PluginDetailsChannelsCardProps> = props => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(sectionNames.channels)}</DashboardCard.Title>
      </DashboardCard.Header>
      <PluginDetailsChannelsCardContent {...props} />
    </DashboardCard>
  );
};

export default PluginDetailsChannelsCard;
