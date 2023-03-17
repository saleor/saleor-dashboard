import { makeStyles } from "@saleor/macaw-ui";

export const useStyles = makeStyles(
  () => ({
    fileField: {
      float: "right",
    },
    pullRight: {
      display: "flex",
      justifyContent: "flex-end",
    },
    swatchInput: {
      paddingTop: 16.5,
      paddingBottom: 16.5,
    },
    swatchPreview: {
      width: 32,
      height: 32,
      borderRadius: 4,
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
  }),
  { name: "AttributeRow" },
);

export const useBasicAttributeStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0,
      },
      padding: theme.spacing(2, 0),
      wordBreak: "break-word",
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex",
    },
    flex: {
      columnGap: theme.spacing(2) + "px",
      display: "flex",
      flexDirection: "row",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        rowGap: theme.spacing(2) + "px",
      },
    },
    value: {
      "&&": {
        overflow: "visible",
      },
    },
    tooltipIcon: {
      fill: theme.palette.type === "dark" ? "#FAFAFA" : "#28234A",
      fillOpacity: 0.6,
      "&:hover": {
        fillOpacity: 1,
      },
      padding: theme.spacing(0.25),
      marginLeft: theme.spacing(0.75),
    },
  }),
  { name: "BasicAttributeRow" },
);
