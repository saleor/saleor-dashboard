import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    container: {
      width: 400,
    },
    innerContainer: {
      width: "100%",
    },
    textField: {
      width: "100%",
      paddingRight: 0,
      "& input": {
        maxWidth: "100%",
      },
    },
    textFieldCentered: {
      "& input": {
        paddingTop: 17,
        paddingBottom: 16,
      },
    },

    // It may seem lazy to set these CSS properties with !important tags, but
    // specificity of overriden styles is really high and refer to mutliple
    // internal classes. Instead of dealing with it and trying to create
    // complex selectors with volatile class names, it's both easier and safer
    // to enforce these styles with !important.
    input: {
      boxShadow: "none !important",
      border: "none",
    },
    noBorder: {
      borderColor: "transparent !important",
    },
    noBackground: {
      backgroundColor: "transparent !important",
    },
  }),
  { name: "TextWithSelectField" },
);
