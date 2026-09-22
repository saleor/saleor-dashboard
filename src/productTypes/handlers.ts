import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent, type FormChange } from "@dashboard/hooks/useForm";

export function handleTaxClassChange(
  event: ChangeEvent,
  taxClasses: TaxClassBaseFragment[],
  formChange: FormChange,
  displayChange: (name: string) => void,
) {
  formChange(event);
  displayChange(taxClasses.find(taxClass => taxClass.id === event.target.value)?.name ?? "");
}
