import {
  AttributeInput,
  AttributeInputData
} from "@saleor/components/Attributes";
import { FormChange } from "@saleor/hooks/useForm";
import { FormsetChange, FormsetData } from "@saleor/hooks/useFormset";
import {
  AttributeInputTypeEnum,
  AttributeValueInput
} from "@saleor/types/globalTypes";
import { toggle } from "@saleor/utils/lists";

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

export function createAttributeChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  triggerChange: () => void
): FormsetChange {
  return (attributeId: string, value: string) => {
    triggerChange();
    changeAttributeData(attributeId, value === "" ? [] : [value]);
  };
}

export function createAttributeMultiChangeHandler(
  changeAttributeData: FormsetChange<string[]>,
  attributes: FormsetData<AttributeInputData, string[]>,
  triggerChange: () => void
): FormsetChange {
  return (attributeId: string, value: string) => {
    const attribute = attributes.find(
      attribute => attribute.id === attributeId
    );

    const newAttributeValues = toggle(
      value,
      attribute.value,
      (a, b) => a === b
    );

    triggerChange();
    changeAttributeData(attributeId, newAttributeValues);
  };
}

interface PageAttributesArgs {
  attributes: AttributeInput[];
  attributesWithAddedNewFiles: AttributeValueInput[];
}

export const prepareAttributesInput = ({
  attributes,
  attributesWithAddedNewFiles
}: PageAttributesArgs): AttributeValueInput[] =>
  attributes.map(attribute => {
    if (attribute.data.inputType === AttributeInputTypeEnum.FILE) {
      const attributeWithNewFile = attributesWithAddedNewFiles.find(
        attributeWithNewFile => attribute.id === attributeWithNewFile.id
      );
      if (attributeWithNewFile) {
        return {
          file: attributeWithNewFile.file,
          id: attributeWithNewFile.id
        };
      }
      return {
        file:
          attribute.data.selectedValues &&
          attribute.data.selectedValues[0]?.file?.url,
        id: attribute.id
      };
    }
    return {
      id: attribute.id,
      values: attribute.value[0] === "" ? [] : attribute.value
    };
  });
