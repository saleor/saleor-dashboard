import { DashboardCard } from "@dashboard/components/Card";
import { ChipField } from "@dashboard/components/ChipField/ChipField";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Plus } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

type Option = { label: string; value: string };

interface AttributeReferenceTypesSectionProps {
  entityType?: AttributeEntityTypeEnum | undefined;
  selectedTypes: Option[];
  disabled?: boolean;
  onAssignClick: () => void;
  onRemoveType?: (id: string) => void;
}

export const AttributeReferenceTypesSection: React.FC<AttributeReferenceTypesSectionProps> = ({
  entityType,
  selectedTypes,
  disabled,
  onAssignClick,
  onRemoveType,
}) => {
  const intl = useIntl();

  return (
    <DashboardCard paddingTop={6}>
      <DashboardCard.Content>
        <Box display="grid" gap={1} data-test-id="attribute-reference-types-section">
          <Box display="flex" alignItems="center" gap={3} justifyContent="space-between">
            <Text size={5} fontWeight="bold">
              {intl.formatMessage(messages.referenceTypesTitle)}
            </Text>
            <Button
              variant="secondary"
              icon={<Plus size={iconSize.medium} strokeWidth={iconStrokeWidth} />}
              onClick={onAssignClick}
              disabled={disabled}
            />
          </Box>
          <Text size={2} color="default2" paddingBottom={2}>
            {intl.formatMessage(messages.referenceTypesHelp)}
          </Text>
          {selectedTypes.length > 0 ? (
            <Box display="flex" gap={2} flexWrap="wrap">
              {selectedTypes.map(type => (
                <ChipField
                  key={type.value}
                  label={type.label}
                  onClose={() => onRemoveType?.(type.value)}
                />
              ))}
            </Box>
          ) : (
            <Text color="default2">
              {entityType === AttributeEntityTypeEnum.PAGE
                ? intl.formatMessage(messages.noModelTypesAssigned)
                : intl.formatMessage(messages.noProductTypesAssigned)}
            </Text>
          )}
        </Box>
      </DashboardCard.Content>
    </DashboardCard>
  );
};
