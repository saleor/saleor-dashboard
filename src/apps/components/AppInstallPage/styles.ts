import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    installAppContainer: {
      "& > div": {
        position: "relative",
      },
      "& img": {
        position: "relative",
      },
      display: "flex",
      justifyContent: "space-between",
      padding: theme.spacing(2, 0),
      position: "relative",
      width: theme.spacing(35),
      "&:before": {
        backgroundColor: theme.palette.divider,
        content: "''",
        height: 2,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: theme.spacing(30),
      },
    },
    installCard: {
      display: "flex",
      justifyContent: "center",
      position: "relative",
    },
    installIcon: {
      alignItems: "center",
      backgroundColor: theme.palette.divider,
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: "50%",
      display: "flex",
      height: theme.spacing(9),
      justifyContent: "center",
      overflow: "hidden",
      width: theme.spacing(9),
    },
    installPermissionTitle: {
      fontWeight: 500,
    },
    installPrivacyText: {
      "& a": {
        color: theme.palette.primary.main,
        textDecoration: "none",
      },
      color: theme.palette.text.hint,
      marginTop: theme.spacing(1),
    },
    installSaleorIcon: {
      backgroundColor:
        theme.palette.type === "dark"
          ? theme.palette.saleor.gray.default
          : theme.palette.saleor.main[1],
      border: "none",
    },
    installSpacer: {
      margin: theme.spacing(2, 0),
    },
    permissionsContainer: {
      "& li": {
        "&:last-child": {
          marginBottom: 0,
        },
        marginBottom: theme.spacing(1),
      },
      paddingLeft: theme.spacing(2),
    },
  }),
  { name: "AppInstallPage" },
);
