import { ProductTypeKindEnum, TaxClassBaseFragment } from "@dashboard/graphql";
import { ChangeEvent, FormChange } from "@dashboard/hooks/useForm";

export const makeProductTypeKindChangeHandler =
  (onChange: FormChange, onKindChange: (kind: ProductTypeKindEnum) => void) =>
  (event: React.ChangeEvent<any>) => {
    const kind = event.target.value as ProductTypeKindEnum;

    onKindChange(kind);
    onChange(event);
  };

export function handleTaxClassChange(
  event: ChangeEvent,
  taxClasses: TaxClassBaseFragment[],
  formChange: FormChange,
  displayChange: (name: string) => void,
) {
  formChange(event);
  displayChange(taxClasses.find(taxClass => taxClass.id === event.target.value)?.name ?? "");
}
