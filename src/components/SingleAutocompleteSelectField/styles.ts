import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  theme => ({
    container: {
      flexGrow: 1,
      position: "relative",
    },
    nakedInput: {
      padding: theme.spacing(2, 0),
    },
    adornment: {
      color: theme.palette.saleor.main[3],
      cursor: "pointer",
      userSelect: "none",
      "& svg": {
        transition: theme.transitions.duration.shorter + "ms",
      },
    },
    adornmentRotate: {
      "& svg": {
        transform: "rotate(180deg)",
      },
    },
  }),
  { name: "SingleAutocompleteSelectField" },
);
