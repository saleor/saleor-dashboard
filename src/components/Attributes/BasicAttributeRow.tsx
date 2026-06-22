import { AttributeInputTypeTooltip } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeTooltip";
import { type AttributeInputTypeEnum, type MeasurementUnitsEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  inputType?: AttributeInputTypeEnum;
  unit?: MeasurementUnitsEnum | null;
  id?: string;
  clickableLabel?: boolean;
  children?: React.ReactNode;
}

const capitalize = (str: BasicAttributeRowProps["label"]) =>
  typeof str === "string" ? str.charAt(0).toUpperCase() + str.slice(1) : str;

export const BasicAttributeRow = ({
  label,
  inputType,
  unit = null,
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
      alignItems="center"
      cursor={clickableLabel ? "pointer" : "auto"}
      __alignSelf={"baseline"}
    >
      <Text>{capitalize(label)}</Text>
      {inputType && <AttributeInputTypeTooltip inputType={inputType} size="xsmall" unit={unit} />}
    </Box>
    <Box data-test-id="attribute-value">{children}</Box>
  </Box>
);
