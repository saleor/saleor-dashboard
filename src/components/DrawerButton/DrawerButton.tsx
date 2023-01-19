import { DevToolsPanel } from "@dashboard/devtools/components/DevToolsPanel";
import { NetworkTabsProvider } from "@dashboard/devtools/hooks/useNetworkTabs";
import { Drawer } from "@material-ui/core";
import { LayoutButton, makeStyles, TransferIcon } from "@saleor/macaw-ui";
import { useState } from "react";

const useStyles = makeStyles(
  () => ({
    drawerWrapper: {
      width: "50vw",
    },
  }),
  { name: "DrawerButton" },
);

const DrawerButton = () => {
  const [open, setOpen] = useState(false);

  const classes = useStyles({});

  return (
    <>
      <LayoutButton variant="secondary" onClick={() => setOpen(!open)}>
        <TransferIcon />
      </LayoutButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className={classes.drawerWrapper}>
          <NetworkTabsProvider>
            <DevToolsPanel />
          </NetworkTabsProvider>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerButton;
