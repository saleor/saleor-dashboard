import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(
  theme => ({
    dialog: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    }
  }),
  { name: "ChannelsAvailabilityDialog" }
);
