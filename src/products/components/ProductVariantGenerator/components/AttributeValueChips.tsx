import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { AttributeData } from "../types";
import { AttributeHeader } from "./AttributeHeader";
import styles from "./AttributeValueChips.module.css";
import { AttributeValueMultiselect } from "./AttributeValueMultiselect";
import { SelectableChip } from "./SelectableChip";

// Threshold for switching from chips to multiselect dropdown
// Chips work well for up to ~12 values, beyond that multiselect is more usable
const CHIP_THRESHOLD = 12;

interface AttributeValueChipsProps {
  attribute: AttributeData;
  selectedIds: Set<string>;
  onToggleValue: (valueId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSetSelected: (valueIds: Set<string>) => void;
}

export const AttributeValueChips = ({
  attribute,
  selectedIds,
  onToggleValue,
  onSelectAll,
  onDeselectAll,
  onSetSelected,
}: AttributeValueChipsProps) => {
  const selectedCount = selectedIds.size;
  const allSelected = selectedCount === attribute.values.length;
  const noneSelected = selectedCount === 0;

  // Use multiselect dropdown for large attribute sets
  if (attribute.values.length > CHIP_THRESHOLD) {
    return (
      <AttributeValueMultiselect
        attribute={attribute}
        selectedIds={selectedIds}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        onSetSelected={onSetSelected}
      />
    );
  }

  // Use chips for small attribute sets
  return (
    <div className={styles.container}>
      <AttributeHeader
        name={attribute.name}
        allSelected={allSelected}
        noneSelected={noneSelected}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
      />
      <div className={styles.chips}>
        {attribute.values.map(value => (
          <SelectableChip
            key={value.id}
            label={value.name ?? ""}
            selected={selectedIds.has(value.id)}
            onClick={() => onToggleValue(value.id)}
            swatch={
              attribute.inputType === AttributeInputTypeEnum.SWATCH
                ? { file: value.file, value: value.value }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
