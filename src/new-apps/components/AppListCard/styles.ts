import { alpha } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    intro: {},
    grid: {
      marginTop: "3.2rem",
      display: "grid",
      gridGap: theme.spacing(5),
      gridTemplateColumns: `repeat(auto-fit, minmax(400px, 1fr))`,
    },
    card: {
      "& .MuiCardContent-root": {
        display: "flex",
        flexDirection: "column",
        height: "100%",
      },
      "& ul": {
        padding: "0 0 5px 0",
        marginLeft: 20,
        marginBottom: 20,
        "& li": {
          padding: "5px 0",
        },
      },
    },
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
      width: 50,
      overflow: "hidden",
      height: 50,
      marginRight: 20,
      borderRadius: 10,
      "& img": {
        maxWidth: "100%",
        maxHeight: "100%",
      },
    },
    description: {
      color:
        theme.palette.type === "dark"
          ? alpha(theme.palette.saleor.generic.light, 0.8)
          : theme.palette.saleor.generic.dark,
      padding: 20,
      fontSize: 16,
    },
    listHeader: {
      fontSize: 14,
      fontWeight: 700,
      marginTop: 10,
      marginBottom: 10,
      textTransform: "uppercase",
      "&:last-of-type": {
        marginTop: "auto",
      },
    },
    logoList: {
      display: "flex",
      gap: 10,
      paddingLeft: 16,
    },
    vendorLogo: {
      width: 50,
      height: 50,
      padding: 10,
      borderRadius: 5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${theme.palette.saleor.generic.mid}`,
      "& img": {
        maxWidth: "100%",
        maxHeight: "100%",
      },
      background:
        theme.palette.type === "light"
          ? "transparent"
          : alpha(theme.palette.saleor.generic.light, 0.3),
    },
    actions: {
      display: "flex",
      gap: 20,
      justifyContent: "flex-end",
      // marginTop: "auto",
      paddingTop: "20px",
    },
    detailsButton: {},
    installButton: {},
    bottomInfo: {
      textAlign: "center",
      borderTop: `1px solid ${theme.palette.saleor.main["5"]}`,
      width: "100%",
      paddingTop: 20,
      color: theme.palette.saleor.main["1"],
      textTransform: "uppercase",
      fontSize: 12,
    },
  }),
  { name: "AppsListCard" },
);
