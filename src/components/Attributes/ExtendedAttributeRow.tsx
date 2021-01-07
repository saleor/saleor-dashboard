import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@saleor/components/Grid";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0
      },
      padding: theme.spacing(2, 0)
    },
    attributeSectionButton: {
      float: "right"
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex"
    }
  }),
  { name: "ExtendedAttributeRow" }
);

interface ExtendedAttributeRowProps {
  label: string;
  selectLabel: string;
  disabled: boolean;
  onSelect: () => void;
}

const ExtendedAttributeRow: React.FC<ExtendedAttributeRowProps> = props => {
  const { label, selectLabel, disabled, onSelect, children } = props;
  const classes = useStyles(props);

  return (
    <>
      <Grid className={classes.attributeSection} variant="uniform">
        <div
          className={classes.attributeSectionLabel}
          data-test="attribute-label"
        >
          <Typography>{label}</Typography>
        </div>
        <div data-test="attribute-selector">
          <Button
            className={classes.attributeSectionButton}
            disabled={disabled}
            variant="text"
            color="primary"
            data-test="button-attribute-selector"
            onClick={onSelect}
          >
            {selectLabel}
          </Button>
        </div>
      </Grid>
      <div data-test="attribute-value">{children}</div>
    </>
  );
};

ExtendedAttributeRow.displayName = "ExtendedAttributeRow";
export default ExtendedAttributeRow;
