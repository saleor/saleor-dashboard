import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    avatar: {
      display: "flex"
    },
    avatarNotAllowed: {
      paddingRight: theme.spacing(2),
      "&:hover $alert": {
        display: "block"
      }
    },
    alert: {
      position: "absolute",
      color: "#fff",
      display: "none",
      zIndex: 1
    }
  }),
  { name: "ProductLineCell" }
);
