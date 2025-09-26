// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import ChannelsAvailabilityMenuContent from "@dashboard/components/ChannelsAvailabilityMenuContent";
import { PluginBaseFragment } from "@dashboard/graphql";
import { isPluginGlobal } from "@dashboard/plugins/views/utils";
import { Popper } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import * as React from "react";

import { mapPluginsToPills } from "../utils";
import GlobalConfigPluginPopupBody from "./GlobalConfigPluginPopupBody";

const useStyles = makeStyles(
  () => ({
    container: {
      maxWidth: 500,
      zIndex: 1000,
    },
  }),
  { name: "PluginChannelsAvailabilityStatusPopup" },
);

interface PluginAvailabilityStatusPopupProps {
  plugin: PluginBaseFragment;
  isOpen: boolean;
  anchor: React.RefObject<HTMLTableCellElement>;
}

const PluginAvailabilityStatusPopup = ({
  plugin,
  isOpen,
  anchor,
}: PluginAvailabilityStatusPopupProps) => {
  const classes = useStyles({});
  const isGlobalPlugin = isPluginGlobal(plugin.globalConfiguration);

  return (
    <Popper placement="left" open={isOpen} className={classes.container} anchorEl={anchor.current}>
      <DashboardCard boxShadow="defaultModal">
        {isGlobalPlugin ? (
          <GlobalConfigPluginPopupBody plugin={plugin} />
        ) : (
          <ChannelsAvailabilityMenuContent
            pills={mapPluginsToPills(plugin.channelConfigurations)}
          />
        )}
      </DashboardCard>
    </Popper>
  );
};

export default PluginAvailabilityStatusPopup;
