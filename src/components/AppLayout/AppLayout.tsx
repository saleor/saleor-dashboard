// import { useUser } from "@dashboard/auth";
import useAppState from "@dashboard/hooks/useAppState";
// import { isDarkTheme } from "@dashboard/misc";
import { LinearProgress } from "@material-ui/core";
import { useActionBar /* useBacklink, useTheme*/ } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
// import clsx from "clsx";
import React from "react";

// import Container from "../Container";
import Navigator from "../Navigator";
// import NavigatorButton from "../NavigatorButton/NavigatorButton";
import { NewSidebar } from "../Sidebar/NewSidebar";
// import UserChip from "../UserChip";
// import useAppChannel from "./AppChannelContext";
// import AppChannelSelect from "./AppChannelSelect";
import { /* useFullSizeStyles,*/ useStyles } from "./styles";

interface AppLayoutProps {
  children: React.ReactNode;
  fullSize?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  // fullSize = false,
}) => {
  const classes = useStyles();
  // const fullSizeClasses = useFullSizeStyles();
  // const { themeType, setTheme } = useTheme();
  const { anchor: appActionAnchor } = useActionBar();
  // const appHeaderAnchor = useBacklink();
  // const { logout, user } = useUser();
  const [appState] = useAppState();
  const [isNavigatorVisible, setNavigatorVisibility] = React.useState(false);

  // const {
  //   availableChannels,
  //   channel,
  //   isPickerActive,
  //   setChannel,
  // } = useAppChannel(false);

  // const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark");

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <Box display="grid" __gridTemplateColumns="auto 325px 1fr">
        {appState.loading ? (
          <LinearProgress className={classes.appLoader} color="primary" />
        ) : (
          <div className={classes.appLoaderPlaceholder} />
        )}
        <Box
          height="100vh"
          borderColor="neutralPlain"
          borderRightWidth={1}
          backgroundColor="subdued"
          borderStyle="solid"
          __position="sticky"
          // @ts-ignore
          __top={0}
          __borderLeftWidth={0}
          __borderTopWidth={0}
          __borderBottomWidth={0}
        >
          <NewSidebar />
        </Box>
        <Box __height="100%" __width="100%">
          <Box as="main" __width="100%">
            {children}
          </Box>
          <Box
            ref={appActionAnchor}
            __position="fixed"
            // @ts-ignore
            __bottom={0}
            __left={325}
            __right={0}
            backgroundColor="plain"
            borderTopWidth={1}
            borderTopStyle="solid"
            borderColor="neutralPlain"
          />
        </Box>
      </Box>
    </>
  );
};

export default AppLayout;
