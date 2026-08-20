import { type CustomerTypeForm } from "@dashboard/customerTypes/components/CustomerTypeDetailsPage/CustomerTypeDetailsPage";

export function isCustomerTypeUpdateFormPristine(
  data: CustomerTypeForm,
  initialData: CustomerTypeForm,
): boolean {
  return data.name === initialData.name && data.slug === initialData.slug;
}
