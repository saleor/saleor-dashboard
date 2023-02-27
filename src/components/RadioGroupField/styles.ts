import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    alignTop: {
      alignSelf: "baseline",
      position: "relative",
      top: -6,
    },
    formLabel: {
      ...theme.typography.body1,
      marginBottom: theme.spacing(1),
    },
    radioGroupInline: {
      flexDirection: "row",
    },
    radioLabel: {
      alignItems: "start",
      marginBottom: theme.spacing(-0.5),
    },
    radioLabelInline: {
      alignItems: "start",
      marginRight: theme.spacing(4),
    },
    label: {
      marginTop: theme.spacing(1.5),
    },
    root: {
      "& $radioLabel": {
        "&:last-of-type": {
          marginBottom: 0,
        },
      },
      padding: 0,
      width: "100%",
    },
    rootNoLabel: {
      marginTop: theme.spacing(-1.5),
    },
  }),
  {
    name: "RadioGroupField",
  },
);
