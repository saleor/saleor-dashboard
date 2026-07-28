import { useEffect } from "react";

interface FormDirtyStateSyncProps {
  enabled: boolean;
  isSaveDisabled?: boolean;
  triggerChange: (value?: boolean) => void;
}

/**
 * Keeps the exit-form dialog dirty flag aligned with a pristine comparison.
 * Run in an effect so navigation in the same handler as a field change is not
 * blocked before the dirty state is updated.
 */
export function FormDirtyStateSync({
  enabled,
  isSaveDisabled,
  triggerChange,
}: FormDirtyStateSyncProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    triggerChange(!isSaveDisabled);
  }, [enabled, isSaveDisabled, triggerChange]);

  return null;
}
