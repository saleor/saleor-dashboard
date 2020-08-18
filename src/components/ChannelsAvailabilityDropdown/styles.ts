import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(
  theme => ({
    caption: {
      paddingLeft: theme.spacing(2)
    },
    hr: {
      left: theme.spacing(-1),
      position: "relative",
      width: `calc(100% + ${theme.spacing(2)}px)`
    },
    menuItem: {
      display: "block"
    },
    title: {
      padding: theme.spacing(1, 2, 1, 2)
    }
  }),
  { name: "ChannelsAvailabilityDropdown" }
);
