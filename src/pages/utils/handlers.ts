import { PageTypeFragment } from "@saleor/fragments/types/PageTypeFragment";
import { FormChange } from "@saleor/hooks/useForm";

export function createPageTypeSelectHandler(
  change: FormChange,
  setPageType: (productType: PageTypeFragment) => void,
  pageTypeChoiceList: PageTypeFragment[]
): FormChange {
  return (event: React.ChangeEvent<any>) => {
    const id = event.target.value;
    const selectedProductType = pageTypeChoiceList.find(
      productType => productType.id === id
    );
    setPageType(selectedProductType);
    change(event);
  };
}
