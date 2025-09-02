import { DashboardCard } from "@dashboard/components/Card";
import SortableChipsField from "@dashboard/components/SortableChipsField";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Button, PlusIcon, Text } from "@saleor/macaw-ui-next";
import { Plus } from "lucide-react";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

type Option = { label: string; value: string };

interface AttributeReferenceTypesSectionProps {
    inputType?: AttributeInputTypeEnum | null;
    selectedTypes: Option[];
    disabled?: boolean;
    onAssignClick: () => void;
    // optional: when you implement removal/reorder
    onRemoveType?: (id: string) => void;
    onReorderTypes?: (oldIndex: number, newIndex: number) => void;
}

const canShow = (inputType?: AttributeInputTypeEnum | null) =>
    inputType === AttributeInputTypeEnum.REFERENCE ||
    inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

export const AttributeReferenceTypesSection: React.FC<AttributeReferenceTypesSectionProps> = ({
    inputType,
    selectedTypes,
    disabled,
    onAssignClick,
    onRemoveType,
    onReorderTypes,
}) => {
    const intl = useIntl();
    
    if (!canShow(inputType)) return null;

    return (
        <DashboardCard paddingTop={6} data-test-id="attribute-values-section">
            <DashboardCard.Content>
                <Box display="grid" gap={1} data-test-id="attribute-reference-types-section">
                    <Box display="flex" alignItems="center" gap={3} justifyContent="space-between">
                        <Text size={5} fontWeight="bold">
                            {intl.formatMessage(messages.referenceTypesTitle)}
                        </Text>
                        <Button
                        variant="secondary"
                        size="small"
                        icon={<Plus size={16} />}
                        aria-label={intl.formatMessage(messages.referenceTypesTitle)}
                        onClick={onAssignClick}
                        disabled={disabled}
                        data-test-id="assign-reference-types"
                    />
                </Box>
                    {selectedTypes.length > 0 ? (
                        <SortableChipsField
                            disabled={disabled}
                            values={selectedTypes}
                            onValueDelete={onRemoveType ?? (() => { })}
                            onValueReorder={
                                onReorderTypes
                                    ? ({ oldIndex, newIndex }) => onReorderTypes(oldIndex, newIndex)
                                    : () => { }
                            }
                        />
                    ) : (
                        <Text color="default2">
                            {intl.formatMessage(messages.noProductTypesAssigned)}
                        </Text>
                    )}
                </Box>
            </DashboardCard.Content>
        </DashboardCard>
    );
};

export default AttributeReferenceTypesSection;