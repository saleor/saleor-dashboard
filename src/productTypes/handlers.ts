import { ProductTypeKindEnum, TaxClassFragment } from "@saleor/graphql";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";

export const makeProductTypeKindChangeHandler = (
  onChange: FormChange,
  onKindChange: (kind: ProductTypeKindEnum) => void,
) => (event: React.ChangeEvent<any>) => {
  const kind = event.target.value as ProductTypeKindEnum;
  onKindChange(kind);
  onChange(event);
};

export function handleTaxClassChange(
  event: ChangeEvent,
  taxClasses: Array<Omit<TaxClassFragment, "countries">>,
  formChange: FormChange,
  displayChange: (name: string) => void,
) {
  formChange(event);
  displayChange(
    taxClasses.find(taxClass => taxClass.id === event.target.value).name,
  );
}
