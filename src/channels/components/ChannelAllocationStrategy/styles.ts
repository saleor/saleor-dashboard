import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    tooltipIcon: {
      color: theme.palette.type === "dark" ? "#FAFAFA" : "#28234A",
      opacity: 0.6,
      "&:hover": {
        opacity: 1,
      },
      padding: theme.spacing(0.25),
      marginLeft: theme.spacing(0.5),
      verticalAlign: "bottom",
    },
    preview: {
      display: "flex",
      gap: theme.spacing(1),
      flexWrap: "wrap",
      alignItems: "center",
    },
  }),
  { name: "ChannelAllocationStrategy" },
);
