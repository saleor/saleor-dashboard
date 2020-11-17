import makeStyles from "@material-ui/core/styles/makeStyles";

export const useStyles = makeStyles(
  theme => ({
    activeBtn: {
      marginLeft: theme.spacing(-1),
      marginTop: theme.spacing(1.5)
    },
    copyBtn: {
      color: theme.palette.primary.main,
      fontSize: 14,
      fontWeight: 500,
      textTransform: "uppercase"
    },
    currencyTitle: {
      marginBottom: theme.spacing(1)
    },
    label: {
      color: theme.palette.text.secondary
    },
    select: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    }
  }),
  { name: "ChannelComponents" }
);
