import { isSameModelTypeIcon } from "@dashboard/components/ModelTypeIcon/getModelTypeIcon";
import { type PageTypeForm } from "@dashboard/modelTypes/components/PageTypeDetailsPage/PageTypeDetailsPage";

export function isPageTypeUpdateFormPristine(
  data: PageTypeForm,
  initialData: PageTypeForm,
): boolean {
  return data.name === initialData.name && isSameModelTypeIcon(data.icon, initialData.icon);
}
