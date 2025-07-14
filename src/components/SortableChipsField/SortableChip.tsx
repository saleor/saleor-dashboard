import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { ReactNode } from "react";

import { DraggableChip } from "../DraggableChip/DraggableChip";

export interface SortableChipProps {
  id: string;
  className?: string;
  label: ReactNode;
  onClose?: () => void;
  loading?: boolean;
  url?: string;
}

export const SortableChip: React.FC<SortableChipProps> = ({
  id,
  className,
  label,
  onClose,
  loading,
  url,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  return (
    <DraggableChip
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      className={className}
      label={label}
      onClose={onClose}
      loading={loading}
      url={url}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
    />
  );
};

SortableChip.displayName = "SortableChip";
