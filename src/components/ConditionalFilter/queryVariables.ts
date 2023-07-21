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
    const [lte, gte] = value;
    return { range: { lte, gte } };
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

const createAttributeQueryPart = (
  attributeSlug: string,
  selected: ConditionSelected,
): AttributeInput => {
  if (!selected.conditionValue) return { slug: attributeSlug };

  const { label } = selected.conditionValue;
  const { value } = selected;

  if (label === "lower" && typeof value === "string") {
    return { slug: attributeSlug, valuesRange: { lte: parseFloat(value) } };
  }

  if (label === "greater" && typeof value === "string") {
    return { slug: attributeSlug, valuesRange: { gte: parseFloat(value) } };
  }

  if (isTuple(value) && label === "between") {
    const [lte, gte] = value;
    return {
      slug: attributeSlug,
      valuesRange: { lte: parseFloat(lte), gte: parseFloat(gte) },
    };
  }

  if (isItemOption(value)) {
    return { slug: attributeSlug, values: [value.value] };
  }

  if (isItemOptionArray(value)) {
    return { slug: attributeSlug, values: value.map(x => x.value) };
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
