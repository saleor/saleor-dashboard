import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getAttributeRowLabelProps,
  getErrorMessage,
  getSingleReferenceDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Pencil, Plus } from "lucide-react";
import { useIntl } from "react-intl";

import { ReferenceValueChip } from "./referenceValueAppearance";
import { type AttributeRowProps } from "./types";
import { useModelReferenceIcons } from "./useModelReferenceIcons";
import { mergeReferenceDetails, useProductReferenceDetails } from "./useProductReferenceDetails";

/** Lucide's pencil fills its box; the plus is drawn inset. 12px matches that mark. */
const editIconSize = 12;

interface SingleReferenceFieldProps {
  attribute: AttributeRowProps["attribute"];
  disabled?: boolean;
  loading?: boolean;
  error?: AttributeRowProps["error"];
  onReferencesAddClick: AttributeRowProps["onReferencesAddClick"];
  onReferencesRemove: AttributeRowProps["onReferencesRemove"];
}

export const SingleReferenceField = ({
  attribute,
  disabled,
  loading,
  error,
  onReferencesAddClick,
  onReferencesRemove,
}: SingleReferenceFieldProps) => {
  const intl = useIntl();
  const referenceIcons = useModelReferenceIcons({
    entityType: attribute.data.entityType,
    ids: attribute.value,
  });
  const referenceDetails = useProductReferenceDetails({
    ids: attribute.value ?? [],
    entityType: attribute.data.entityType,
  });
  const selected = getSingleReferenceDisplayValue(attribute, referenceIcons);
  const selectedWithDetails = selected
    ? mergeReferenceDetails([selected], referenceDetails)[0]
    : null;

  return (
    <BasicAttributeRow label={attribute.label} {...getAttributeRowLabelProps(attribute)}>
      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        {selectedWithDetails ? (
          <>
            <ReferenceValueChip
              value={selectedWithDetails}
              entityType={attribute.data.entityType}
              thumbnailUrl={selectedWithDetails.thumbnailUrl}
              onRemove={() => onReferencesRemove(attribute.id, [])}
            />
            <Button
              variant="secondary"
              size="small"
              onClick={() => onReferencesAddClick(attribute)}
              disabled={disabled || loading}
              icon={
                <Pencil
                  size={editIconSize}
                  strokeWidth={(iconStrokeWidthBySize.small * iconSize.small) / editIconSize}
                />
              }
              marginLeft="auto"
              data-test-id="single-ref-edit"
            />
          </>
        ) : (
          <Button
            variant="secondary"
            size="small"
            onClick={() => onReferencesAddClick(attribute)}
            disabled={disabled || loading}
            icon={<Plus size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
            marginLeft="auto"
            data-test-id="single-ref-add"
          />
        )}
      </Box>
      {error && (
        <Box marginTop={2}>
          <Text size={2} color="critical1">
            {getErrorMessage(error, intl)}
          </Text>
        </Box>
      )}
    </BasicAttributeRow>
  );
};

SingleReferenceField.displayName = "SingleReferenceField";
