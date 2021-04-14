import { Card, makeStyles, Popper } from "@material-ui/core";
import { Plugin_plugin } from "@saleor/plugins/types/Plugin";
import React from "react";

import { isPluginGlobal } from "../utils";
import ChannelConfigPluginPopupBody from "./ChannelConfigPluginPopupBody";
import GlobalConfigPluginPopupBody from "./GlobalConfigPluginPopupBody";

const useStyles = makeStyles(
  () => ({
    container: {
      maxWidth: 300
    }
  }),
  { name: "index" }
);

interface PluginAvailabilityStatusPopupProps {
  plugin: Plugin_plugin;
}

const PluginAvailabilityStatusPopup: React.FC<PluginAvailabilityStatusPopupProps> = ({
  plugin
}) => {
  const classes = useStyles({});

  const isGlobalPlugin = isPluginGlobal(plugin.globalConfiguration);

  return (
    <Popper open={true} className={classes.container}>
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
