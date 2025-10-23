import backgroundArt from "@assets/images/login-background.svg";
import saleorLogo from "@assets/images/saleor-logo.svg";
import saleorLogoWhite from "@assets/images/saleor-logo-white.svg";
import { makeStyles, useTheme } from "@saleor/macaw-ui";
import { ReactNode } from "react";
import SVG from "react-inlinesvg";

import { useUser } from "..";
import LoginLoading from "./LoginLoading";

const useStyles = makeStyles(
  theme => ({
    logo: {
      display: "block",
      height: 40,
      marginBottom: theme.spacing(4),
    },
    mainPanel: {
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2),
      },
      background: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      justifyContent: "center",
      padding: theme.spacing(5, 6, 4, 6),
      width: "100%",
    },
    mainPanelContent: {
      [theme.breakpoints.up("xs")]: {
        width: "100%",
      },
      [theme.breakpoints.up("sm")]: {
        width: 328,
      },
      "@media (min-width: 1440px)": {
        width: 380,
      },
      margin: "auto",
      width: "100%",
    },
    root: {
      [theme.breakpoints.up("lg")]: {
        gridTemplateColumns: "560px 1fr",
      },
      "@media (min-width: 1440px)": {
        gridTemplateColumns: "780px 1fr",
      },
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: theme.spacing(3),
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      width: "100vw",
    },
    sidebar: {
      [theme.breakpoints.up("lg")]: {
        alignItems: "center",
        display: "flex",
      },
      display: "none",
    },
    sidebarArt: {
      "& svg": {
        width: "100%",
      },
    },
  }),
  {
    name: "Layout",
  },
);
const Layout = (props: { children: ReactNode }) => {
  const { children } = props;
  const { errors } = useUser();
  const classes = useStyles(props);
  const { themeType } = useTheme();

  // show fullscreen loading when there is externalLoginError - we will redirect and
  // logout user in meantime
  if (errors.some(item => item === "externalLoginError")) {
    return <LoginLoading />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.mainPanel}>
        <SVG className={classes.logo} src={themeType === "dark" ? saleorLogoWhite : saleorLogo} />
        <div className={classes.mainPanelContent}>{children}</div>
      </div>
      <div className={classes.sidebar}>
        <SVG className={classes.sidebarArt} src={backgroundArt} />
      </div>
    </div>
  );
};

Layout.displayName = "Layout";
export default Layout;
