import { DashboardCard } from "@dashboard/components/Card";
import { sectionNames } from "@dashboard/intl";
import { useIntl } from "react-intl";

import PluginDetailsChannelsCardContent, {
  PluginDetailsChannelsCardProps,
} from "./PluginDetailsChannelsCardContent";

const PluginDetailsChannelsCard = (props: PluginDetailsChannelsCardProps) => {
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
