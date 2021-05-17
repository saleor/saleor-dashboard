import { Card, Popper } from "@material-ui/core";
import { Plugin_plugin } from "@saleor/plugins/types/Plugin";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
import { makeStyles } from "@saleor/theme";
import React from "react";

import ChannelConfigPluginPopupBody from "./ChannelConfigPluginPopupBody";
import GlobalConfigPluginPopupBody from "./GlobalConfigPluginPopupBody";

const useStyles = makeStyles(
  () => ({
    container: {
      maxWidth: 300,
      zIndex: 1000
    }
  }),
  { name: "PluginChannelsAvailabilityStatusPopup" }
);

interface PluginAvailabilityStatusPopupProps {
  plugin: Plugin_plugin;
  isOpen: boolean;
  anchor: React.RefObject<HTMLTableCellElement>;
}

const PluginAvailabilityStatusPopup: React.FC<PluginAvailabilityStatusPopupProps> = ({
  plugin,
  isOpen,
  anchor
}) => {
  const classes = useStyles({});

  const isGlobalPlugin = isPluginGlobal(plugin.globalConfiguration);

  return (
    <Popper
      placement="left"
      open={isOpen}
      className={classes.container}
      anchorEl={anchor.current}
    >
      <Card>
        {isGlobalPlugin ? (
          <GlobalConfigPluginPopupBody plugin={plugin} />
        ) : (
          <ChannelConfigPluginPopupBody plugin={plugin} />
        )}
      </Card>
    </Popper>
  );
};

export default PluginAvailabilityStatusPopup;
