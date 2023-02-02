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
import { Sidebar } from "../Sidebar";
// import NavigatorButton from "../NavigatorButton/NavigatorButton";
// import UserChip from "../UserChip";
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

  // const toggleTheme = () => setTheme(isDarkTheme(themeType) ? "light" : "dark");

  return (
    <>
      <Navigator
        visible={isNavigatorVisible}
        setVisibility={setNavigatorVisibility}
      />
      <Box display="grid" __gridTemplateColumns="auto auto 1fr">
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
          position="sticky"
          top={0}
          borderLeftWidth={0}
          borderTopWidth={0}
          borderBottomWidth={0}
        >
          <Sidebar />
        </Box>
        <Box height="100%" width="100%">
          <Box as="main" width="100%">
            {children}
          </Box>
          <Box
            ref={appActionAnchor}
            position="sticky"
            bottom={0}
            left={0}
            right={0}
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
