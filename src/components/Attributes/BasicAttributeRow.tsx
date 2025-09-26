import { Box, InfoIcon, sprinkles, Text, Tooltip } from "@saleor/macaw-ui-next";
import * as React from "react";

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  id?: string;
  clickableLabel?: boolean;
  children?: React.ReactNode;
}

const capitalize = (str: BasicAttributeRowProps["label"]) =>
  typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const BasicAttributeRow = ({
  label,
  description,
  children,
  id,
  clickableLabel = false,
}: BasicAttributeRowProps) => (
  <Box
    as="li"
    justifyContent="space-between"
    alignItems="center"
    paddingY={2}
    display="grid"
    gridTemplateColumns={2}
    __gridTemplateColumns="1fr 2fr"
    gap={5}
  >
    <Box
      data-test-id="attribute-label"
      as="label"
      htmlFor={id}
      display="flex"
      gap={1}
      cursor={clickableLabel ? "pointer" : "auto"}
      __alignSelf={"baseline"}
    >
      <Text marginTop={2}>{capitalize(label)}</Text>
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
