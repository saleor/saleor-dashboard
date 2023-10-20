import { DatagridChange } from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import {
  AttributeInputTypeEnum,
  AttributeValueDetailsFragment,
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
  values: AttributeValueDetailsFragment[],
): BulkAttributeValueInput => {
  if (inputType === AttributeInputTypeEnum.FILE) {
    return {
      file: values[0]?.file?.url ?? null,
    };
  }

  if (inputType === AttributeInputTypeEnum.NUMERIC) {
    return {
      numeric: values[0]?.name ?? null,
    };
  }

  if (inputType === AttributeInputTypeEnum.DROPDOWN) {
    return {
      dropdown: {
        id: values[0]?.id,
        value: values[0]?.id ? undefined : values[0]?.name ?? null,
      },
    };
  }

  if (inputType === AttributeInputTypeEnum.MULTISELECT) {
    return {
      multiselect: values.map(({ id }) => ({ id })),
    };
  }

  if (inputType === AttributeInputTypeEnum.SWATCH) {
    return {
      swatch: {
        id: values[0]?.id,
        value: values[0]?.id ? undefined : values[0]?.name ?? null,
      },
    };
  }

  if (inputType === AttributeInputTypeEnum.BOOLEAN) {
    let booleanValue: boolean;

    const value = values[0]?.name || "";

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
      plainText: values[0]?.name ?? null,
    };
  }
  if (inputType === AttributeInputTypeEnum.RICH_TEXT) {
    return {
      richText: values[0]?.richText ?? null,
    };
  }

  if (inputType === AttributeInputTypeEnum.REFERENCE) {
    return {
      references: values.map(({ reference }) => reference),
    };
  }

  if (inputType === AttributeInputTypeEnum.DATE) {
    return {
      date: values[0]?.date ?? null,
    };
  }

  if (inputType === AttributeInputTypeEnum.DATE_TIME) {
    return {
      dateTime: values[0]?.dateTime ?? null,
    };
  }

  return {
    values: values.map(({ name }) => name),
  };
};
