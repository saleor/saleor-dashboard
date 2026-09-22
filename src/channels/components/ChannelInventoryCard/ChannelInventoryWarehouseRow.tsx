import DeletableItem from "@dashboard/components/DeletableItem/DeletableItem";
import { DragHandle } from "@dashboard/components/DragHandle/DragHandle";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import styles from "./ChannelInventoryCard.module.css";

interface ChannelInventoryWarehouseRowProps {
  id: string;
  name: string;
  /** 1-based position shown beside the drag handle. */
  position: number;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export const ChannelInventoryWarehouseRow = ({
  id,
  name,
  position,
  onDelete,
  disabled = false,
}: ChannelInventoryWarehouseRowProps): ReactNode => {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={styles.row}
      data-test-id="channel-inventory-warehouse-row"
      data-disabled={disabled ? "true" : undefined}
    >
      <div className={styles.rowMain}>
        <span className={styles.rowHandle} {...attributes} {...listeners}>
          <DragHandle
            cursor={disabled ? "not-allowed" : isSorting ? "grabbing" : "grab"}
            data-test-id="button-drag-handle"
          />
        </span>
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
  );
};
