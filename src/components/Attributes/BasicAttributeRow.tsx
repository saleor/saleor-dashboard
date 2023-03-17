import { Tooltip } from "@saleor/macaw-ui";
import { Box, InfoIcon, sprinkles, Text } from "@saleor/macaw-ui/next";
import React from "react";

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  id?: string;
  clickableLabel?: boolean;
}

export const BasicAttributeRow: React.FC<BasicAttributeRowProps> = ({
  label,
  description,
  children,
  id,
  clickableLabel = false,
}) => (
  <Box
    as="li"
    justifyContent="space-between"
    alignItems="center"
    paddingY={3}
    display="grid"
    gridTemplateColumns={2}
    gap={8}
  >
    <Box
      data-test-id="attribute-label"
      as="label"
      htmlFor={id}
      display="flex"
      gap={3}
      cursor={clickableLabel ? "pointer" : "auto"}
    >
      <Text>{label}</Text>
      {description && (
        <Tooltip title={description} placement="top">
          <Box>
            <InfoIcon
              size="small"
              className={sprinkles({
                display: "block",
              })}
            />
          </Box>
        </Tooltip>
      )}
    </Box>
    <Box data-test-id="attribute-value">{children}</Box>
  </Box>
);
