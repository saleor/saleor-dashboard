import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { Container } from "@dashboard/types";
import { useState } from "react";

interface UseAssignDialogSingleSelectionProps {
  items: Array<{ id: string; name: string }>;
  selectedId?: string;
  open: boolean;
  onSubmit: (data: Container[]) => void;
}

export function useAssignDialogSingleSelection({
  items,
  selectedId,
  open,
  onSubmit,
}: UseAssignDialogSingleSelectionProps): {
  selectedItemId: string;
  handleSelect: (id: string) => void;
  handleSubmit: () => void;
} {
  const [selectedItemId, setSelectedItemId] = useState<string>(selectedId ?? "");

  useModalDialogOpen(open, {
    onOpen: () => setSelectedItemId(selectedId ?? ""),
  });

  const handleSelect = (id: string): void => {
    setSelectedItemId(id === selectedItemId ? "" : id);
  };

  const handleSubmit = (): void => {
    if (selectedItemId) {
      const selectedItem = items.find(item => item.id === selectedItemId);

      if (selectedItem) {
        onSubmit([{ id: selectedItem.id, name: selectedItem.name }]);

        return;
      }
    }

    onSubmit([]);
  };

  return { selectedItemId, handleSelect, handleSubmit };
}
