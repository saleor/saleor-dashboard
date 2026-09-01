import { type MetadataFormData } from "@dashboard/components/Metadata/types";
import { type TaxClassRateInput } from "@dashboard/graphql";
import { type FormsetData } from "@dashboard/hooks/useFormset";

export interface TaxClassesPageFormData extends MetadataFormData {
  id: string;
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}
