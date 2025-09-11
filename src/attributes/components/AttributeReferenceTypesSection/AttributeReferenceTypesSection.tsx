import { ENTITY_TYPES_WITH_TYPES_RESTRICTION,REFERENCE_ATTRIBUTE_TYPES } from "@dashboard/attributes/utils/data";
import { DashboardCard } from "@dashboard/components/Card";
import ChipField from "@dashboard/components/ChipField";
import { AttributeEntityTypeEnum,AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Button, PlusIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

type Option = { label: string; value: string };

interface AttributeReferenceTypesSectionProps {
    inputType?: AttributeInputTypeEnum | null;
    entityType?: AttributeEntityTypeEnum | null;
    selectedTypes: Option[];
    disabled?: boolean;
    onAssignClick: () => void;
    onRemoveType?: (id: string) => void;
}

const canShow = (inputType?: AttributeInputTypeEnum, entityType?: AttributeEntityTypeEnum) =>
    inputType ? (REFERENCE_ATTRIBUTE_TYPES.includes(inputType) && ENTITY_TYPES_WITH_TYPES_RESTRICTION.includes(entityType)) : false;

export const AttributeReferenceTypesSection: React.FC<AttributeReferenceTypesSectionProps> = ({
    inputType,
    entityType,
    selectedTypes,
    disabled,
    onAssignClick,
    onRemoveType,
}) => {
    const intl = useIntl();
    
    if (!canShow(inputType, entityType)) return null;
  
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
                icon={<PlusIcon />}
                onClick={onAssignClick}
                disabled={disabled}
              />
            </Box>
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

export default AttributeReferenceTypesSection;