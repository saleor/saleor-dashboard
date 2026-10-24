import { AttributeInputTypeTooltip } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeTooltip";
import {
  type AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  type MeasurementUnitsEnum,
} from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import type * as React from "react";

import { AttributeReferenceEntityIcon } from "./AttributeReferenceEntityIcon";
import { useAttributeRowChrome } from "./attributeRowChrome";

interface BasicAttributeRowProps {
  label: string | React.ReactNode;
  inputType?: AttributeInputTypeEnum;
  entityType?: AttributeEntityTypeEnum | null;
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
  entityType,
  unit = null,
  children,
  id,
  clickableLabel = false,
}: BasicAttributeRowProps) => {
  const isCardRow = useAttributeRowChrome() === "card";
  // A label centred against a tall rich text editor floats mid-field, so keep it at the top.
  const centerLabel = isCardRow && inputType !== AttributeInputTypeEnum.RICH_TEXT;

  return (
    <Box
      as="li"
      justifyContent="space-between"
      alignItems="center"
      paddingY={2}
      display="grid"
      gridTemplateColumns={2}
      __gridTemplateColumns="1fr 2fr"
      gap={5}
      minWidth={0}
    >
      <Box
        data-test-id="attribute-label"
        as="label"
        htmlFor={id}
        display="flex"
        gap={1}
        alignItems="center"
        cursor={clickableLabel ? "pointer" : "auto"}
        __alignSelf={centerLabel ? "center" : "baseline"}
      >
        {isCardRow ? (
          <Text fontWeight="medium" color="default1">
            {capitalize(label)}
          </Text>
        ) : (
          <Text>{capitalize(label)}</Text>
        )}
        {inputType && <AttributeInputTypeTooltip inputType={inputType} size="xsmall" unit={unit} />}
        <AttributeReferenceEntityIcon entityType={entityType} />
      </Box>
      <Box data-test-id="attribute-value" minWidth={0}>
        {children}
      </Box>
    </Box>
  );
};
