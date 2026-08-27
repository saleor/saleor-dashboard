import { AttributeInputTypeEnum } from "@dashboard/graphql";

import { type ItemOption } from "../FilterElement/ConditionValue";

export type SwatchAttributeFields = {
  swatchColor?: string;
  swatchFileUrl?: string;
};

export const isSwatchAttributeType = (type?: string | null): boolean =>
  type === AttributeInputTypeEnum.SWATCH;

export const isSwatchAttributeOption = (option: SwatchAttributeFields): boolean =>
  Boolean(option.swatchColor || option.swatchFileUrl);

export const createAttributeChoiceOptionsFromAPI = (
  data: Array<{
    node: {
      name: string | null;
      id: string;
      slug: string;
      originalSlug?: string | null;
      value?: string | null;
      file?: { url?: string | null } | null;
    };
  }>,
  inputType?: string | null,
): ItemOption[] =>
  data.map(({ node }) => {
    const option: ItemOption = {
      label: node.name ?? "",
      value: node.id,
      slug: node.slug,
      originalSlug: node.originalSlug,
    };

    if (inputType != null && !isSwatchAttributeType(inputType)) {
      return option;
    }

    const swatchColor = node.value?.trim();
    const swatchFileUrl = node.file?.url;

    if (swatchColor) {
      option.swatchColor = swatchColor;
    }

    if (swatchFileUrl) {
      option.swatchFileUrl = swatchFileUrl;
    }

    return option;
  });
