import { FormChange } from "@saleor/hooks/useForm";

export function createPageTypeSelectHandler(
  setPageType: (pageTypeId: string) => void,
  triggerChange: () => void,
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    setPageType(id);
    triggerChange();
  };
}
