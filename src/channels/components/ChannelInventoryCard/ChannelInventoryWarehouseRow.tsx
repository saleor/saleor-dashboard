import DeletableItem from "@dashboard/components/DeletableItem";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";
// Legacy shared with AssignmentList — migrate together to @dnd-kit.
// eslint-disable-next-line no-restricted-imports
import { SortableElement, type SortableElementProps } from "react-sortable-hoc";

import SortableHandle from "../AssignmentList/SortableHandle";
import styles from "./ChannelInventoryCard.module.css";

interface ChannelInventoryWarehouseRowProps extends SortableElementProps {
  id: string;
  name: string;
  /** 1-based position shown beside the drag handle. */
  position: number;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

/** @deprecated SortableElement — migrate with AssignmentList to @dnd-kit. */
export const ChannelInventoryWarehouseRow = SortableElement(
  ({
    id,
    name,
    position,
    onDelete,
    disabled = false,
  }: ChannelInventoryWarehouseRowProps): ReactNode => (
    <div
      className={styles.row}
      data-test-id="channel-inventory-warehouse-row"
      data-disabled={disabled ? "true" : undefined}
    >
      <div className={styles.rowMain}>
        <SortableHandle data-test-id="button-drag-handle" />
        <Text as="span" className={styles.rowIndex} size={2}>
          {position}
        </Text>
        <Text size={3} fontWeight="medium" className={styles.rowName}>
          {name}
        </Text>
      </div>
      <div className={styles.rowDelete}>
        <DeletableItem id={id} onDelete={onDelete} disabled={disabled} />
      </div>
    </div>
  ),
);
