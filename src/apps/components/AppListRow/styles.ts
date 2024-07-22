import { alpha } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    card: {
      display: "flex",
      flexDirection: "column",
    },
    cardContent: {
      height: "100%",
    },
  }),
  { name: "AppListCard" },
);

export const useDescriptionStyles = makeStyles(
  theme => ({
    cardHeader: {
      fontWeight: 600,
      fontSize: 20,
      fontFamily: "sans-serif",
    },
    cardToolbar: {
      display: "flex",
      alignItems: "center",
    },
    logo: {
      color: "#fff",
      width: 50,
      overflow: "hidden",
      height: 50,
      marginRight: 20,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& img": {
        maxWidth: "100%",
        maxHeight: "100%",
      },
    },
    description: {
      color: theme.palette.saleor.main[3],
      margin: theme.spacing(3, 0, 1, 0),
    },
  }),
  {
    name: "AppListCardDescription",
  },
);

export const useLinksStyles = makeStyles(
  theme => ({
    linkList: {
      display: "flex",
      gap: 10,
      margin: theme.spacing(1, 0, 4, 0),
      padding: 0,
      listStyleType: "none",
    },
  }),
  { name: "AppListCardLinks" },
);

export const useIntegrationsStyles = makeStyles(
  theme => ({
    listHeader: {
      fontSize: 14,
      fontWeight: 700,
      color: theme.palette.saleor.main[3],
      margin: theme.spacing(2, 0),
      textTransform: "uppercase",
    },
    logoList: {
      display: "flex",
      gap: theme.spacing(2),
      margin: 0,
      padding: 0,
    },
    vendorLogo: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& img": {
        maxWidth: "100%",
        maxHeight: "100%",
      },
      background:
        theme.palette.type === "light"
          ? "transparent"
          : alpha(theme.palette.saleor.generic.light, 0.3),
    },
  }),
  { name: "AppListCardIntegrations" },
);
