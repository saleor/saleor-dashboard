import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(
  theme => ({
    label: {
      color: theme.palette.text.secondary
    },
    select: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    }
  }),
  { name: "ChannelsAvailabilityDialog" }
);
