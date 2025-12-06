import { BasicAttributeRow } from "@dashboard/components/Attributes/BasicAttributeRow";
import {
  getErrorMessage,
  getSingleReferenceDisplayValue,
} from "@dashboard/components/Attributes/utils";
import { ChipField } from "@dashboard/components/ChipField/ChipField";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { Pencil, Plus } from "lucide-react";
import { useIntl } from "react-intl";

import { AttributeRowProps } from "./types";

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
  const selected = getSingleReferenceDisplayValue(attribute);

  return (
    <BasicAttributeRow label={attribute.label}>
      <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
        {selected ? (
          <>
            <ChipField
              label={selected.label}
              url={selected.url}
              loading={loading}
              onClose={() => onReferencesRemove(attribute.id, [])}
            />
            <Button
              variant="secondary"
              onClick={() => onReferencesAddClick(attribute)}
              disabled={disabled || loading}
              icon={<Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              marginLeft="auto"
              data-test-id="single-ref-edit"
            />
          </>
        ) : (
          <Button
            variant="secondary"
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
