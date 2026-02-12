import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { Container } from "@dashboard/types";
import { useState } from "react";

interface UseAssignDialogMultiSelectionProps {
  open: boolean;
  onSubmit: (data: Container[]) => void;
}

export function useAssignDialogMultiSelection({
  open,
  onSubmit,
}: UseAssignDialogMultiSelectionProps): {
  selectedItems: Container[];
  isSelected: (id: string) => boolean;
  handleToggle: (item: Container) => void;
  handleSubmit: () => void;
} {
  const [selectedItems, setSelectedItems] = useState<Container[]>([]);

  useModalDialogOpen(open, {
    onOpen: () => setSelectedItems([]),
  });

  const isSelected = (id: string): boolean => selectedItems.some(item => item.id === id);

  const handleToggle = (item: Container): void => {
    setSelectedItems(prev =>
      prev.some(i => i.id === item.id) ? prev.filter(i => i.id !== item.id) : [...prev, item],
    );
  };

  const handleSubmit = (): void => onSubmit(selectedItems);

  return { selectedItems, isSelected, handleToggle, handleSubmit };
}
