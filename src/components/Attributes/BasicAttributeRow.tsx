import { Typography } from "@material-ui/core";
import Grid from "@saleor/components/Grid";
import { makeStyles } from "@saleor/theme";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0
      },
      padding: theme.spacing(2, 0),
      wordBreak: "break-word"
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex"
    }
  }),
  { name: "BasicAttributeRow" }
);

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  valueContainerClassName?: string;
}

const BasicAttributeRow: React.FC<BasicAttributeRowProps> = ({
  label,
  children,
  valueContainerClassName
}) => {
  const classes = useStyles();

  return (
    <Grid className={classes.attributeSection} variant="uniform">
      <div
        className={classes.attributeSectionLabel}
        data-test="attribute-label"
      >
        <Typography>{label}</Typography>
      </div>
      <div data-test="attribute-value" className={valueContainerClassName}>
        {children}
      </div>
    </Grid>
  );
};

BasicAttributeRow.displayName = "BasicAttributeRow";
export default BasicAttributeRow;
