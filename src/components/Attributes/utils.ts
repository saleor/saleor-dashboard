// @ts-strict-ignore
import { AttributeInput } from "@dashboard/components/Attributes/Attributes";
import { FileChoiceType } from "@dashboard/components/FileUploadField";
import { SortableChipsFieldValueType } from "@dashboard/components/SortableChipsField";
import {
  AttributeValueFragment,
  PageErrorWithAttributesFragment,
  ProductErrorWithAttributesFragment,
} from "@dashboard/graphql";
import { getProductErrorMessage } from "@dashboard/utils/errors";
import getPageErrorMessage from "@dashboard/utils/errors/page";
import { getEntityUrl } from "@dashboard/utils/maps";
import { OutputData } from "@editorjs/editorjs";
import { Option } from "@saleor/macaw-ui-next";
import { IntlShape } from "react-intl";

export function getSingleChoices(values: AttributeValueFragment[]): Option[] {
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

export function getReferenceDisplayValue(attribute: AttributeInput): SortableChipsFieldValueType[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.data.references.map(referenceData => {
    return {
      label: referenceData.label,
      value: referenceData.value,
      url: getEntityUrl({
        entityType: attribute.data.entityType,
        entityId: referenceData.value,
      }),
    };
  });
}

export function getMultiChoices(values: AttributeValueFragment[]): Option[] {
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
    attribute.data.values.find(value => value.slug === attribute.value[0])?.name ||
    attribute.value[0] ||
    ""
  );
}

export function getMultiDisplayValue(
  attribute: AttributeInput,
  attributeValues: AttributeValueFragment[],
): Option[] {
  if (!attribute.value) {
    return [];
  }

  return attribute.value.map(attributeValue => {
    const definedAttributeValue =
      attributeValues.find(definedValue => definedValue.slug === attributeValue) ||
      attribute.data.values.find(definedValue => definedValue.slug === attributeValue);

    if (definedAttributeValue) {
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

export function booleanAttrValueToValue(value: unknown | undefined): string {
  if (typeof value !== "boolean") {
    return "unset";
  }

  return value ? "true" : "false";
}

export function getBooleanDropdownOptions(intl: IntlShape) {
  return [
    {
      label: intl.formatMessage({
        defaultMessage: "True",
        id: "7WEeNq",
        description: "select label",
      }),
      value: "true",
    },
    {
      label: intl.formatMessage({
        defaultMessage: "False",
        id: "b1j4K6",
        description: "select label",
      }),
      value: "false",
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Unset",
        id: "k62BKw",
        description: "select label",
      }),
      value: "unset",
    },
  ];
}

export function getTruncatedTextValue(value: string | undefined, length: number) {
  if (!value) {
    return value;
  }

  return value.length > length ? value.slice(0, length) + "..." : value;
}
