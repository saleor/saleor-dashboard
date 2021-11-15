import { Card, Popper } from "@material-ui/core";
import { PluginBaseFragment } from "@saleor/fragments/types/PluginBaseFragment";
import { makeStyles } from "@saleor/macaw-ui";
import { isPluginGlobal } from "@saleor/plugins/views/utils";
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
  plugin: PluginBaseFragment;
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
