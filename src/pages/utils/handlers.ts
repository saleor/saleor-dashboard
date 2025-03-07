// @ts-strict-ignore
import { FormChange } from "@dashboard/hooks/useForm";
import { ChangeEvent } from "react";

export function createPageTypeSelectHandler(
  setPageType: (pageTypeId: string) => void,
  triggerChange: () => void,
): FormChange {
  return (event: ChangeEvent<any>) => {
    const id = event.target.value;

    setPageType(id);
    triggerChange();
  };
}
