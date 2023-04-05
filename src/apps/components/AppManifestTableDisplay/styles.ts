import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    "@keyframes pulse": {
      from: { transform: "scale(1)" },
      to: { transform: "scale(1.2)" },
    },
    manifestText: {
      color: theme.palette.text.secondary,
      display: "inline",
      "&:hover svg": {
        visibility: "visible",
      },
    },
    copyIcon: {
      marginLeft: theme.spacing(1),
      visibility: "hidden",
      verticalAlign: "middle",
      transition: "0.2s",
      cursor: "pointer",
    },
    copyIconColorful: {
      color: theme.palette.primary.main,
      animation: "$pulse 0.2s",
    },
  }),
  { name: "AppManifestTableDisplay" },
);
