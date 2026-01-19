import { GridTable } from "@dashboard/components/GridTable";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import {
  AttributeValueSelection,
  AttributeWithSelections,
  ExistingVariantCombination,
} from "../types";
import styles from "./VariantMatrix.module.css";

interface VariantMatrixProps {
  attributes: AttributeWithSelections[];
  existingCombinations: ExistingVariantCombination[][];
}

const ColorDot = ({ value }: { value: AttributeValueSelection }) => {
  if (!value.file?.url && !value.value) {
    return null;
  }

  return (
    <span
      className={styles.colorDot}
      style={
        value.file?.url
          ? { backgroundImage: `url(${value.file.url})` }
          : { backgroundColor: value.value ?? undefined }
      }
    />
  );
};

/**
 * Checks if a specific combination of two attribute values already exists.
 */
function combinationExists(
  rowAttrId: string,
  rowValueSlug: string | null,
  colAttrId: string,
  colValueSlug: string | null,
  existingCombinations: Array<{ attributeId: string; valueSlug: string | null }[]>,
): boolean {
  return existingCombinations.some(
    combo =>
      combo.some(c => c.attributeId === rowAttrId && c.valueSlug === rowValueSlug) &&
      combo.some(c => c.attributeId === colAttrId && c.valueSlug === colValueSlug),
  );
}

export const VariantMatrix = ({ attributes, existingCombinations }: VariantMatrixProps) => {
  const intl = useIntl();

  // Get selected values for each attribute
  const selectedByAttribute = useMemo(
    () =>
      attributes.map(attr => ({
        id: attr.id,
        name: attr.name,
        inputType: attr.inputType,
        values: attr.values.filter(v => v.selected),
      })),
    [attributes],
  );

  // For matrix view, we need exactly 2 attributes with selections
  const canShowMatrix =
    selectedByAttribute.length === 2 && selectedByAttribute.every(attr => attr.values.length > 0);

  if (!canShowMatrix) {
    return (
      <Box className={styles.emptyState}>
        <Text size={2} color="default2">
          {intl.formatMessage(messages.matrixRequiresTwoAttributes)}
        </Text>
      </Box>
    );
  }

  const [rowAttr, colAttr] = selectedByAttribute;
  const columnCount = colAttr.values.length + 1; // +1 for row label column

  return (
    <div className={styles.matrixContainer}>
      <GridTable className={styles.table}>
        <GridTable.Colgroup>
          {/* All columns equal width */}
          {Array.from({ length: columnCount }).map((_, i) => (
            <GridTable.Col key={i} className={styles.equalCol} />
          ))}
        </GridTable.Colgroup>

        <GridTable.Body>
          {/* Header row */}
          <GridTable.Row className={styles.headerRow}>
            <GridTable.Cell className={styles.cornerCell}>
              <span className={styles.cornerText}>
                {rowAttr.name} / {colAttr.name}
              </span>
            </GridTable.Cell>
            {colAttr.values.map(value => (
              <GridTable.Cell key={value.id} className={styles.columnHeaderCell}>
                <Box className={styles.columnHeaderContent} title={value.name ?? undefined}>
                  {colAttr.inputType === AttributeInputTypeEnum.SWATCH && (
                    <ColorDot value={value} />
                  )}
                  <span className={styles.columnHeaderText}>{value.name}</span>
                </Box>
              </GridTable.Cell>
            ))}
          </GridTable.Row>

          {/* Data rows */}
          {rowAttr.values.map(rowValue => (
            <GridTable.Row key={rowValue.id}>
              <GridTable.Cell className={styles.rowLabelCell} title={rowValue.name ?? undefined}>
                <span className={styles.rowLabelText}>{rowValue.name}</span>
              </GridTable.Cell>
              {colAttr.values.map(colValue => {
                const exists = combinationExists(
                  rowAttr.id,
                  rowValue.slug,
                  colAttr.id,
                  colValue.slug,
                  existingCombinations,
                );

                return (
                  <GridTable.Cell key={colValue.id} className={styles.dataCell}>
                    {exists ? (
                      <Text size={2} color="default2">
                        {intl.formatMessage(messages.existsBadge)}
                      </Text>
                    ) : (
                      <span className={styles.newBadge}>
                        {intl.formatMessage(messages.newBadge)}
                      </span>
                    )}
                  </GridTable.Cell>
                );
              })}
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>
    </div>
  );
};
