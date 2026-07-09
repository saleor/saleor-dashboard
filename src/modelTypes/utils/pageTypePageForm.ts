import { type PageTypeForm } from "@dashboard/modelTypes/components/PageTypeDetailsPage/PageTypeDetailsPage";

export function isPageTypeUpdateFormPristine(
  data: PageTypeForm,
  initialData: PageTypeForm,
): boolean {
  return data.name === initialData.name;
}
