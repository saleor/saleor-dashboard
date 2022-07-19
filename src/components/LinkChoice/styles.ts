import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    arrow: {
      position: "relative",
      top: 6,
      transition: theme.transitions.duration.short + "ms",
    },
    highlighted: {
      background: theme.palette.background.default,
    },
    menuItem: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing(),
      },
      borderRadius: 4,
    },
    paper: {
      padding: theme.spacing(),
    },
    popper: {
      marginTop: theme.spacing(1),
      zIndex: 2,
    },
    root: {
      "&:focus, &:hover": {
        textDecoration: "underline",
      },
      outline: 0,
      position: "relative",
    },
    rotate: {
      transform: "rotate(180deg)",
    },
  }),
  {
    name: "LinkChoice",
  },
);
