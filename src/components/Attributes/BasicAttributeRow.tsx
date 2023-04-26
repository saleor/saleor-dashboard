import Grid from "@dashboard/components/Grid";
import { Typography } from "@material-ui/core";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { Tooltip } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

import { useBasicAttributeStyles } from "./styles";

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  flexValueContainer?: boolean;
}

const BasicAttributeRow: React.FC<BasicAttributeRowProps> = ({
  label,
  description,
  children,
  flexValueContainer,
}) => {
  const classes = useBasicAttributeStyles();

  return (
    <Grid className={classes.attributeSection} variant="uniform">
      <div
        className={classes.attributeSectionLabel}
        data-test-id="attribute-label"
      >
        <Typography>
          {label}
          {description && (
            <Tooltip>
              <Tooltip.Trigger>
                <HelpOutline className={classes.tooltipIcon} />
              </Tooltip.Trigger>
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow />
                {description}
              </Tooltip.Content>
            </Tooltip>
          )}
        </Typography>
      </div>
      <div
        data-test-id="attribute-value"
        className={clsx(classes.value, {
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
