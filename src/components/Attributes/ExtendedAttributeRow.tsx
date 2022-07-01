import { Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import Grid from "@saleor/components/Grid";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    attributeSection: {
      "&:last-of-type": {
        paddingBottom: 0,
      },
      padding: theme.spacing(2, 0),
    },
    attributeSectionButton: {
      float: "right",
    },
    attributeSectionLabel: {
      alignItems: "center",
      display: "flex",
    },
  }),
  { name: "ExtendedAttributeRow" },
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
          data-test-id="attribute-label"
        >
          <Typography>{label}</Typography>
        </div>
        <div data-test-id="attribute-selector">
          <Button
            className={classes.attributeSectionButton}
            disabled={disabled}
            variant="tertiary"
            data-test-id="button-attribute-selector"
            onClick={onSelect}
          >
            {selectLabel}
          </Button>
        </div>
      </Grid>
      <div data-test-id="attribute-value">{children}</div>
    </>
  );
};

ExtendedAttributeRow.displayName = "ExtendedAttributeRow";
export default ExtendedAttributeRow;
