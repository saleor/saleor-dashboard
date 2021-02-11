import { AttributeInputData } from "@saleor/components/Attributes";
import { FormChange } from "@saleor/hooks/useForm";
import { FormsetData } from "@saleor/hooks/useFormset";

import { PageDetails_page_pageType } from "../types/PageDetails";
import { getAttributeInputFromPageType } from "./data";

export function createPageTypeSelectHandler(
  change: FormChange,
  setAttributes: (data: FormsetData<AttributeInputData>) => void,
  setPageType: (pageType: PageDetails_page_pageType) => void,
  pageTypeChoiceList: PageDetails_page_pageType[]
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    const selectedPageType = pageTypeChoiceList.find(
      pageType => pageType.id === id
    );
    setPageType(selectedPageType);
    change(event);

    setAttributes(getAttributeInputFromPageType(selectedPageType));
  };
}
