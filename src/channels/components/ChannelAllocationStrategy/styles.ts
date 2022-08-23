import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    option: {
      marginTop: theme.spacing(-0.25),
      marginBottom: theme.spacing(),
    },
  }),
  { name: "ChannelAllocationStrategy" },
);
