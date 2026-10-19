import { AttributeInputTypeTooltip } from "@dashboard/components/AttributeInputTypeIcon/AttributeInputTypeTooltip";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  type AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  type MeasurementUnitsEnum,
} from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type ReactNode } from "react";
import { defineMessages, useIntl } from "react-intl";

import { useAttributeDescriptionCollapsed } from "./attributeDescriptionCollapse";
import { AttributeReferenceEntityIcon } from "./AttributeReferenceEntityIcon";
import { useAttributeRowChrome } from "./attributeRowChrome";
import styles from "./BasicAttributeRow.module.css";

const messages = defineMessages({
  showDescription: {
    id: "kVNXNN",
    defaultMessage: "Show description",
    description: "attribute row, button that expands the attribute internal description",
  },
  hideDescription: {
    id: "86Ufj1",
    defaultMessage: "Hide description",
    description: "attribute row, button that collapses the attribute internal description",
  },
});

interface BasicAttributeRowProps {
  label: string | ReactNode;
  inputType?: AttributeInputTypeEnum;
  entityType?: AttributeEntityTypeEnum | null;
  unit?: MeasurementUnitsEnum | null;
  id?: string;
  attributeId?: string;
  internalDescription?: string | null;
  clickableLabel?: boolean;
  children?: ReactNode;
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
  attributeId,
  internalDescription,
  clickableLabel = false,
}: BasicAttributeRowProps) => {
  const intl = useIntl();
  const isCardRow = useAttributeRowChrome() === "card";
  const { collapsed, toggle } = useAttributeDescriptionCollapsed(attributeId);
  const hasDescription = Boolean(internalDescription?.trim());
  const ChevronIcon = collapsed ? ChevronRight : ChevronDown;
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
        data-test-id="attribute-label-column"
        display="flex"
        flexDirection="column"
        gap={1}
        minWidth={0}
        __alignSelf={centerLabel ? "center" : "baseline"}
      >
        <Box display="flex" gap={1} alignItems="center">
          <Box
            data-test-id="attribute-label"
            as="label"
            htmlFor={id}
            display="flex"
            gap={1}
            alignItems="center"
            cursor={clickableLabel ? "pointer" : "auto"}
          >
            {isCardRow ? (
              <Text fontWeight="medium" color="default1">
                {capitalize(label)}
              </Text>
            ) : (
              <Text>{capitalize(label)}</Text>
            )}
            {inputType && (
              <AttributeInputTypeTooltip inputType={inputType} size="xsmall" unit={unit} />
            )}
            <AttributeReferenceEntityIcon entityType={entityType} />
          </Box>
          {hasDescription && (
            <Button
              type="button"
              variant="tertiary"
              size="small"
              data-test-id="attribute-description-toggle"
              aria-expanded={!collapsed}
              aria-label={intl.formatMessage(
                collapsed ? messages.showDescription : messages.hideDescription,
              )}
              icon={<ChevronIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              onClick={toggle}
            />
          )}
        </Box>
        {hasDescription && !collapsed && (
          <Text
            size={2}
            color="default2"
            className={styles.description}
            data-test-id="attribute-description"
          >
            {internalDescription}
          </Text>
        )}
      </Box>
      <Box data-test-id="attribute-value" minWidth={0}>
        {children}
      </Box>
    </Box>
  );
};
