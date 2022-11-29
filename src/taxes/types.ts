import { MetadataFormData } from "@saleor/components/Metadata";
import { TaxClassRateInput } from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";

export interface TaxClassesPageFormData extends MetadataFormData {
  id: string;
  updateTaxClassRates: FormsetData<TaxClassRateInput>;
  name?: string;
}
