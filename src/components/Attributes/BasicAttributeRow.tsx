import { Typography } from "@material-ui/core";
import Grid from "@saleor/components/Grid";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";

const useStyles = makeStyles(
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
  }),
  { name: "BasicAttributeRow" },
);

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  flexValueContainer?: boolean;
}

const BasicAttributeRow: React.FC<BasicAttributeRowProps> = ({
  label,
  children,
  flexValueContainer,
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.attributeSection} variant="uniform">
      <div
        className={classes.attributeSectionLabel}
        data-test-id="attribute-label"
      >
        <Typography>{label}</Typography>
      </div>
      <div
        data-test-id="attribute-value"
        className={classNames(classes.value, {
          [classes.flex]: flexValueContainer,
        })}
      >
        {children}
      </div>
    </Grid>
  );
};

BasicAttributeRow.displayName = "BasicAttributeRow";
export default BasicAttributeRow;
