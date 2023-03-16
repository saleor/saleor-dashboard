import { Typography } from "@material-ui/core";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { Tooltip } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui/next";
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
    <Box as="li">
      <div
        className={classes.attributeSectionLabel}
        data-test-id="attribute-label"
      >
        <Typography>
          {label}
          {description && (
            <Tooltip title={description}>
              <HelpOutline className={classes.tooltipIcon} />
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
    </Box>
  );
};

BasicAttributeRow.displayName = "BasicAttributeRow";
export default BasicAttributeRow;
