import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";

export function createPageTypeSelectHandler(
  setPageType: (pageTypeId: string) => void,
  triggerChange: () => void,
): FormChange {
  return (event: ChangeEvent<any>, cb?: () => void) => {
    const id = event.target.value;

    setPageType(id);
    triggerChange();

    if (cb) {
      cb();
    }
  };
}
