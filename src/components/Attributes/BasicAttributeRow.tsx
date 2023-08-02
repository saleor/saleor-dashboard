import { Box, InfoIcon, sprinkles, Text, Tooltip } from "@saleor/macaw-ui/next";
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
    paddingY={6}
    paddingX={0.5}
    display="grid"
    gridTemplateColumns={2}
    gap={5}
  >
    <Box
      data-test-id="attribute-label"
      as="label"
      htmlFor={id}
      display="flex"
      gap={1}
      cursor={clickableLabel ? "pointer" : "auto"}
    >
      <Text>{label}</Text>
      {description && (
        <Tooltip>
          <Tooltip.Trigger>
            <Box>
              <InfoIcon
                size="small"
                className={sprinkles({
                  display: "block",
                })}
              />
            </Box>
          </Tooltip.Trigger>
          <Tooltip.Content side="top">
            <Tooltip.Arrow />
            {description}
          </Tooltip.Content>
        </Tooltip>
      )}
    </Box>
    <Box data-test-id="attribute-value">{children}</Box>
  </Box>
);
