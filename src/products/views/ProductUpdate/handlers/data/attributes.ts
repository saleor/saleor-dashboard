import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  AttributeInputTypeEnum,
  AttributeValueDetailsFragment,
  AttributeValueInput,
  BulkAttributeValueInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import { getColumnAttribute, isCurrentRow } from "@dashboard/products/utils/datagrid";

import { byAttributeName } from "../utils";

export function getAttributeData(
  data: DatagridChange[],
  currentIndex: number,
  variantAttributes: VariantAttributeFragment[],
) {
  return data
    .filter(change => isCurrentRow(change.row, currentIndex))
    .filter(byHavingAnyAttribute)
    .map(toAttributeData(variantAttributes));
}

function byHavingAnyAttribute(change: DatagridChange): boolean {
  return !!getColumnAttribute(change.column);
}

function toAttributeData(variantAttributes: VariantAttributeFragment[]) {
  return (change: DatagridChange): AttributeValueInput | undefined => {
    const attributeId = getColumnAttribute(change.column);
    const attributeType = getAttributeType(variantAttributes, attributeId ?? "");

    if (!attributeType) {
      return undefined;
    }

    return {
      id: attributeId,
      ...getDatagridAttributeInput(attributeType, change.data.value.value),
    };
  };
}

export function getAttributeType(
  source: VariantAttributeFragment[],
  attributeId: string,
): AttributeInputTypeEnum | undefined | null {
  const attributeVariant = source.find(attr => attr.id === attributeId);

  return attributeVariant?.inputType;
}

// Datagrid only support PLAIN_TEXT and DROPDOWN attribute types
function getDatagridAttributeInput(
  inputType: AttributeInputTypeEnum,
  value = "",
): BulkAttributeValueInput {
  if (inputType === "DROPDOWN") {
    return {
      dropdown: {
        value,
      },
    };
  }

  if (inputType === "PLAIN_TEXT") {
    return {
      plainText: value,
    };
  }

  return {
    values: [value],
  };
}

// ProductUpdateForm supports all attribute types
export function getAttributeInput(
  inputType: AttributeInputTypeEnum,
  values: AttributeValueDetailsFragment[],
): BulkAttributeValueInput {
  if (inputType === "FILE") {
    return {
      file: values[0]?.file?.url ?? null,
    };
  }

  if (inputType === "NUMERIC") {
    return {
      numeric: getAttributeValueOrNull(values[0], "name"),
    };
  }

  if (inputType === "DROPDOWN") {
    return {
      dropdown: {
        value: getAttributeValueOrNull(values[0], "name"),
      },
    };
  }

  if (inputType === "MULTISELECT") {
    return {
      multiselect: values.map(({ id }) => ({ id })),
    };
  }

  if (inputType === "SWATCH") {
    return {
      swatch: {
        value: getAttributeValueOrNull(values[0], "name"),
      },
    };
  }

  if (inputType === "BOOLEAN") {
    return {
      boolean: getBooleanValue(values[0]),
    };
  }

  if (inputType === "PLAIN_TEXT") {
    return {
      plainText: getAttributeValueOrNull(values[0], "name"),
    };
  }

  if (inputType === "RICH_TEXT") {
    return {
      richText: getAttributeValueOrNull(values[0], "richText"),
    };
  }

  if (inputType === "REFERENCE") {
    return {
      references: values.map(({ reference }) => reference).filter(byAttributeName),
    };
  }

  if (inputType === "SINGLE_REFERENCE") {
    return {
      reference: values?.[0]?.reference || null,
    };
  }

  if (inputType === "DATE") {
    return {
      date: getAttributeValueOrNull(values[0], "date"),
    };
  }

  if (inputType === "DATE_TIME") {
    return {
      dateTime: getAttributeValueOrNull(values[0], "dateTime"),
    };
  }

  return {
    values: values.map(({ name }) => name).filter(byAttributeName),
  };
}

function getAttributeValueOrNull(
  value: AttributeValueDetailsFragment | undefined,
  field: keyof AttributeValueDetailsFragment,
): string | null {
  if (value?.[field]) {
    return value[field];
  }

  return null;
}

function getBooleanValue(value: AttributeValueDetailsFragment | undefined): boolean {
  const booleanValue = getAttributeValueOrNull(value, "name") || "";

  if (booleanValue.includes("true") || booleanValue.includes("false")) {
    return booleanValue === "true";
  }

  if (booleanValue.includes("Yes") || booleanValue.includes("No")) {
    return booleanValue.includes("Yes");
  }

  return false;
}
