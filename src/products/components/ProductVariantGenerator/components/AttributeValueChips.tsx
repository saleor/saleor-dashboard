import { Button, Text } from "@saleor/macaw-ui-next";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { messages } from "../messages";
import { AttributeWithSelections } from "../types";
import styles from "./AttributeValueChips.module.css";
import { SelectableChip } from "./SelectableChip";

interface AttributeValueChipsProps {
  attribute: AttributeWithSelections;
  onToggleValue: (valueId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export const AttributeValueChips = ({
  attribute,
  onToggleValue,
  onSelectAll,
  onDeselectAll,
}: AttributeValueChipsProps) => {
  const intl = useIntl();

  const selectedCount = useMemo(
    () => attribute.values.filter(v => v.selected).length,
    [attribute.values],
  );

  const allSelected = selectedCount === attribute.values.length;
  const noneSelected = selectedCount === 0;

  const handleToggle = useCallback(
    (valueId: string) => {
      onToggleValue(valueId);
    },
    [onToggleValue],
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text size={3} fontWeight="medium">
          {attribute.name}
        </Text>
        <div className={styles.actions}>
          <Button variant="tertiary" size="small" onClick={onSelectAll} disabled={allSelected}>
            {intl.formatMessage(messages.selectAll)}
          </Button>
          <Button variant="tertiary" size="small" onClick={onDeselectAll} disabled={noneSelected}>
            {intl.formatMessage(messages.selectNone)}
          </Button>
        </div>
      </div>
      <div className={styles.chips}>
        {attribute.values.map(value => (
          <SelectableChip
            key={value.id}
            label={value.name ?? ""}
            selected={value.selected}
            onClick={() => handleToggle(value.id)}
            swatch={
              attribute.inputType === "SWATCH"
                ? { file: value.file, value: value.value }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
