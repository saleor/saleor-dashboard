import { GridTable } from "@dashboard/components/GridTable";
import { AttributeInputTypeEnum } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
// Note: Parent component (ProductVariantGenerator) only renders this when canShowMatrix is true
import {
  AttributeData,
  AttributeValue,
  ExistingVariantCombination,
  SelectionState,
} from "../types";
import styles from "./VariantMatrix.module.css";

interface VariantMatrixProps {
  attributes: AttributeData[];
  selections: SelectionState;
  existingCombinations: ExistingVariantCombination[][];
}

const ColorDot = ({ value }: { value: AttributeValue }) => {
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
  existingCombinations: ExistingVariantCombination[][],
): boolean {
  return existingCombinations.some(
    combo =>
      combo.length === 2 &&
      combo.some(c => c.attributeId === rowAttrId && c.valueSlug === rowValueSlug) &&
      combo.some(c => c.attributeId === colAttrId && c.valueSlug === colValueSlug),
  );
}

export const VariantMatrix = ({
  attributes,
  selections,
  existingCombinations,
}: VariantMatrixProps) => {
  const intl = useIntl();

  // Get only attributes that have at least one selected value
  // Parent ensures exactly 2 attributes with selections (canShowMatrix check)
  const selectedByAttribute = useMemo(
    () =>
      attributes
        .map(attr => ({
          id: attr.id,
          name: attr.name,
          inputType: attr.inputType,
          values: attr.values.filter(v => selections[attr.id]?.has(v.id)),
        }))
        .filter(attr => attr.values.length > 0),
    [attributes, selections],
  );

  // Safety check - parent should ensure this, but guard against runtime issues
  if (selectedByAttribute.length !== 2) {
    return null;
  }

  const [rowAttr, colAttr] = selectedByAttribute;
  const columnCount = colAttr.values.length + 1; // +1 for row label column

  return (
    <div className={styles.wrapper}>
      <div className={styles.matrixContainer}>
        <GridTable className={styles.table} borderTopStyle="none" borderBottomStyle="none">
          <GridTable.Colgroup>
            {/* All columns equal width */}
            {Array.from({ length: columnCount }).map((_, i) => (
              <GridTable.Col key={i} className={styles.equalCol} />
            ))}
          </GridTable.Colgroup>

          <GridTable.Body>
            {/* Header row */}
            <GridTable.Row className={styles.headerRow}>
              <GridTable.Cell className={styles.cornerCell} borderTopStyle="none" />
              {colAttr.values.map(value => (
                <GridTable.Cell
                  key={value.id}
                  className={styles.columnHeaderCell}
                  borderTopStyle="none"
                >
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
    </div>
  );
};
