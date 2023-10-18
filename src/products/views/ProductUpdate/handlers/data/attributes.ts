import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  AttributeInputTypeEnum,
  AttributeValueInput,
  BulkAttributeValueInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import {
  getColumnAttribute,
  isCurrentRow,
} from "@dashboard/products/utils/datagrid";

export function getAttributeData(
  data: DatagridChange[],
  currentIndex: number,
  removedIds: number[],
  variantsAttributes: VariantAttributeFragment[],
) {
  return data
    .filter(change => isCurrentRow(change.row, currentIndex, removedIds))
    .filter(byHavingAnyAttribute)
    .map(toAttributeData(variantsAttributes));
}

function byHavingAnyAttribute(change: DatagridChange): boolean {
  return !!getColumnAttribute(change.column);
}

function toAttributeData(variantsAttributes: VariantAttributeFragment[]) {
  return (change: DatagridChange): AttributeValueInput => {
    const attributeId = getColumnAttribute(change.column);

    const attributeVariant = variantsAttributes.find(
      variant => variant.id === attributeId,
    );
    if (!attributeVariant) {
      return undefined;
    }

    const attributeVariantType = snakeToCamel(
      attributeVariant.inputType.toLocaleUpperCase(),
    ) as AttributeInputTypeEnum;

    return {
      id: attributeId,
      ...getDatagridAttributeInput(
        attributeVariantType,
        change.data.value.value,
      ),
    };
  };
}
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, group =>
    group.toUpperCase().replace("-", "").replace("_", ""),
  );
}

// Datagrid only support PLAIN_TEXT and DROPDOWN atribut types
export const getDatagridAttributeInput = (
  inputType: AttributeInputTypeEnum,
  value: string = "",
): BulkAttributeValueInput => {
  if (inputType === AttributeInputTypeEnum.DROPDOWN) {
    return {
      dropdown: {
        value,
      },
    };
  }

  if (inputType === AttributeInputTypeEnum.PLAIN_TEXT) {
    return {
      plainText: value,
    };
  }
};

export const getAttributeInput = (
  inputType: AttributeInputTypeEnum,
  values: string[] = [],
): BulkAttributeValueInput => {
  if (inputType === AttributeInputTypeEnum.FILE) {
    return {
      file: values[0],
    };
  }

  if (inputType === AttributeInputTypeEnum.NUMERIC) {
    return {
      numeric: values[0],
    };
  }

  if (inputType === AttributeInputTypeEnum.DROPDOWN) {
    return {
      dropdown: {
        value: values[0],
      },
    };
  }

  if (inputType === AttributeInputTypeEnum.MULTISELECT) {
    return {
      multiselect: values.map(value => ({ value })),
    };
  }

  if (inputType === AttributeInputTypeEnum.SWATCH) {
    return {
      swatch: {
        value: values[0],
      },
    };
  }

  if (inputType === AttributeInputTypeEnum.BOOLEAN) {
    let booleanValue: boolean;

    const value = values[0] || "";

    if (value.includes("true") || value.includes("false")) {
      booleanValue = value === "true";
    }

    if (value.includes("Yes") || value.includes("No")) {
      booleanValue = value.includes("Yes");
    }

    return {
      boolean: booleanValue || false,
    };
  }

  if (inputType === AttributeInputTypeEnum.PLAIN_TEXT) {
    return {
      plainText: values[0],
    };
  }
  if (inputType === AttributeInputTypeEnum.RICH_TEXT) {
    return {
      richText: values,
    };
  }

  if (inputType === AttributeInputTypeEnum.REFERENCE) {
    return {
      references: values,
    };
  }

  if (inputType === AttributeInputTypeEnum.DATE) {
    return {
      date: values[0] || null,
    };
  }

  if (inputType === AttributeInputTypeEnum.DATE_TIME) {
    return {
      dateTime: values[0] || null,
    };
  }

  return {
    values,
  };
};
