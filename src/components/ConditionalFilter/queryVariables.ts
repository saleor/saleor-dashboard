import {
  AttributeInput,
  DecimalFilterInput,
  GlobalIdFilterInput,
  ProductWhereInput,
} from "@dashboard/graphql";

import { FilterContainer } from "./FilterElement";
import { ConditionSelected } from "./FilterElement/ConditionSelected";
import {
  isItemOption,
  isItemOptionArray,
  isTuple,
} from "./FilterElement/ConditionValue";

type StaticQueryPart =
  | string
  | GlobalIdFilterInput
  | boolean
  | DecimalFilterInput;

const createStaticQueryPart = (
  selected: ConditionSelected,
): StaticQueryPart => {
  if (!selected.conditionValue) return "";

  const { label } = selected.conditionValue;
  const { value } = selected;

  if (label === "lower") {
    return { range: { lte: value } };
  }
  if (label === "greater") {
    return { range: { gte: value } };
  }

  if (isTuple(value) && label === "between") {
    const [gte, lte] = value;
    return { range: { lte, gte } };
  }

  if (isItemOption(value) && ["true", "false"].includes(value.value)) {
    return value.value === "true";
  }

  if (isItemOption(value)) {
    return { eq: value.value };
  }

  if (isItemOptionArray(value)) {
    return { oneOf: value.map(x => x.value) };
  }

  if (typeof value === "string") {
    return { eq: value };
  }

  if (Array.isArray(value)) {
    return { eq: value };
  }

  return value;
};

const getRangeQueryPartByType = (value: [string, string], type: string) => {
  const [gte, lte] = value;

  switch (type) {
    case "datetime.range":
      return { dateTime: { lte, gte } };
    case "date.range":
      return { date: { lte, gte } };
    case "number.range":
    default:
      return { valuesRange: { lte: parseFloat(lte), gte: parseFloat(gte) } };
  }
};

const getQueryPartByType = (
  value: string,
  type: string,
  what: "lte" | "gte",
) => {
  switch (type) {
    case "datetime":
      return { dateTime: { [what]: value } };
    case "date":
      return { date: { [what]: value } };
    default:
      return { valuesRange: { [what]: parseFloat(value) } };
  }
};

const createAttributeQueryPart = (
  attributeSlug: string,
  selected: ConditionSelected,
): AttributeInput => {
  if (!selected.conditionValue) return { slug: attributeSlug };

  const { label, type } = selected.conditionValue;
  const { value } = selected;

  if (label === "lower" && typeof value === "string") {
    return { slug: attributeSlug, ...getQueryPartByType(value, type, "lte") };
  }

  if (label === "greater" && typeof value === "string") {
    return { slug: attributeSlug, ...getQueryPartByType(value, type, "gte") };
  }

  if (isTuple(value) && label === "between") {
    return {
      slug: attributeSlug,
      ...getRangeQueryPartByType(value, type),
    };
  }

  if (isItemOption(value)) {
    return { slug: attributeSlug, values: [value.originalSlug || value.value] };
  }

  if (isItemOptionArray(value)) {
    return {
      slug: attributeSlug,
      values: value.map(x => x.originalSlug || x.value),
    };
  }

  if (typeof value === "string") {
    return { slug: attributeSlug, values: [value] };
  }

  if (Array.isArray(value)) {
    return { slug: attributeSlug, values: value };
  }

  if (value === "true" || value === "false") {
    return { slug: attributeSlug, boolean: value };
  }

  return value;
};

type ProductQueryVars = ProductWhereInput & { channel?: { eq: string } };

export const createProductQueryVariables = (
  value: FilterContainer,
): ProductQueryVars => {
  return value.reduce(
    (p, c) => {
      if (typeof c === "string" || Array.isArray(c)) return p;

      if (c.isStatic()) {
        p[c.value.value as keyof ProductWhereInput] = createStaticQueryPart(
          c.condition.selected,
        );
      }

      if (c.isAttribute()) {
        p.attributes!.push(
          createAttributeQueryPart(c.value.value, c.condition.selected),
        );
      }

      return p;
    },
    { attributes: [] } as ProductWhereInput,
  );
};
