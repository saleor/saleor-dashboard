import { OutputData } from "@editorjs/editorjs";
import { AttributeInput } from "@saleor/components/Attributes/Attributes";
import { FileChoiceType } from "@saleor/components/FileUploadField";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { SortableChipsFieldValueType } from "@saleor/components/SortableChipsField";
import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@saleor/graphql";
import { getProductErrorMessage } from "@saleor/utils/errors";
import getPageErrorMessage from "@saleor/utils/errors/page";
import { IntlShape } from "react-intl";

export function getSingleChoices(
  values: AttributeValueFragment[],
): SingleAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug,
  }));
}

export const getRichTextData = (attribute: AttributeInput): OutputData => {
  const data = attribute.data.selectedValues?.[0]?.richText;
  return data ? JSON.parse(data) : {};
};

export function getFileChoice(attribute: AttributeInput): FileChoiceType {
  const attributeValue = attribute.value?.length > 0 && attribute.value[0];

  const definedAttributeValue = attribute.data.values.find(
    definedValue => definedValue.slug === attributeValue,
  );

  if (definedAttributeValue) {
    return {
      file: definedAttributeValue.file,
      label: definedAttributeValue.name,
      value: definedAttributeValue.slug,
    };
  }

  return {
    label: attributeValue,
    value: attributeValue,
  };
}

export function getReferenceDisplayValue(
  attribute: AttributeInput,
): SortableChipsFieldValueType[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.value.map(attributeValue => {
    const definedAttributeValue = attribute.data.values.find(
      definedValue => definedValue.reference === attributeValue,
    );
    // If value has been previously assigned, use it's data
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.reference,
      };
    }

    const definedAttributeReference = attribute.data.references?.find(
      reference => reference.value === attributeValue,
    );
    // If value has not been yet assigned, use data of reference
    if (!!definedAttributeReference) {
      return definedAttributeReference;
    }

    return {
      label: attributeValue,
      value: attributeValue,
    };
  });
}

export function getMultiChoices(
  values: AttributeValueFragment[],
): MultiAutocompleteChoiceType[] {
  return values.map(value => ({
    label: value.name,
    value: value.slug,
  }));
}

export function getSingleDisplayValue(
  attribute: AttributeInput,
  attributeValues: AttributeValueFragment[],
): string {
  return (
    attributeValues.find(value => value.slug === attribute.value[0])?.name ||
    attribute.data.values.find(value => value.slug === attribute.value[0])
      ?.name ||
    attribute.value[0] ||
    ""
  );
}

export function getMultiDisplayValue(
  attribute: AttributeInput,
  attributeValues: AttributeValueFragment[],
): MultiAutocompleteChoiceType[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.value.map(attributeValue => {
    const definedAttributeValue =
      attributeValues.find(
        definedValue => definedValue.slug === attributeValue,
      ) ||
      attribute.data.values.find(
        definedValue => definedValue.slug === attributeValue,
      );
    if (!!definedAttributeValue) {
      return {
        label: definedAttributeValue.name,
        value: definedAttributeValue.slug,
      };
    }

    return {
      label: attributeValue,
      value: attributeValue,
    };
  });
}

export function getErrorMessage(
  err: ProductErrorWithAttributesFragment | PageErrorWithAttributesFragment,
  intl: IntlShape,
): string {
  switch (err?.__typename) {
    case "ProductError":
      return getProductErrorMessage(err, intl);
    case "PageError":
      return getPageErrorMessage(err, intl);
  }
}
