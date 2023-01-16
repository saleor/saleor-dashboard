import { MetadataFormData } from "@dashboard/components/Metadata";
import { TaxClassRateInput } from "@dashboard/graphql";
import { FormsetData } from "@dashboard/hooks/useFormset";

export interface TaxClassesPageFormData extends MetadataFormData {
  id: string;
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}
