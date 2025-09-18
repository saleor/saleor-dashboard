import { ProductErrorCode, ProductErrorWithAttributesFragment } from "@dashboard/graphql";
import { IntlShape } from "react-intl";
import { z } from "zod";

import { ProductCreateData } from "../components/ProductCreatePage";
import { ProductVariantCreateData } from "../components/ProductVariantCreatePage/form";
import { ProductVariantUpdateSubmitData } from "../components/ProductVariantPage/form";

/**
 * 验证价格。
 *
 * @param {string} price - 要验证的价格。
 * @returns {boolean} 价格是否有效。
 */
export const validatePrice = (price: string) => price === "" || parseInt(price, 10) < 0;

/**
 * 验证成本价。
 *
 * @param {string} price - 要验证的成本价。
 * @returns {boolean} 成本价是否有效。
 */
export const validateCostPrice = (price: string) => price !== "" && parseInt(price, 10) < 0;

const toChannelPriceField = (id: string) => `${id}-channelListing-price`;
const createRequiredError = (
  field: string,
  message: string | null = null,
): ProductErrorWithAttributesFragment => ({
  __typename: "ProductError",
  code: ProductErrorCode.REQUIRED,
  field,
  message,
  attributes: [],
});

/**
 * 验证产品创建数据。
 *
 * @param {ProductCreateData} [data] - 要验证的产品创建数据。
 * @returns {ProductErrorWithAttributesFragment[]} 错误列表。
 */
export const validateProductCreateData = (data?: ProductCreateData) => {
  let errors: ProductErrorWithAttributesFragment[] = [];

  if (!data) {
    return errors;
  }

  if (!data.productType) {
    errors = [...errors, createRequiredError("productType")];
  }

  if (!data.name) {
    errors = [...errors, createRequiredError("name")];
  }

  const { productType, channelListings } = data;

  if (!productType.hasVariants && channelListings) {
    const emptyPrices = data.channelListings
      .filter(channel => channel.price?.length === 0)
      .map(({ id }) => createRequiredError(toChannelPriceField(id)));

    errors = [...errors, ...emptyPrices];
  }

  return errors;
};

const channelListingValueSchema = z.object({
  price: z.number().or(z.string().min(1)),
});

const channelListingSchema = z
  .object({
    channelListings: z.array(
      z.object({
        value: channelListingValueSchema,
      }),
    ),
    variantName: z.string().min(1),
  })
  .partial();

/**
 * @typedef {ProductVariantCreateData | ProductVariantUpdateSubmitData} ProductVariantType
 *
 * 表示产品变体的类型。
 */
export type ProductVariantType = ProductVariantCreateData | ProductVariantUpdateSubmitData;

const handleValidationError = (
  error: z.ZodIssue,
  data: ProductVariantType,
  defaultMessage: string,
) => {
  const defaultError = createRequiredError(error.path.join("-"), defaultMessage);

  switch (error.code) {
    case "too_small":
    case "invalid_union":
    case "invalid_type":
      if (error.path.includes("price") && error.path.includes("channelListings")) {
        // Due to the way the form was written
        // The path is in format "channelListing => {index} => price"
        const index = error.path[1] as number;
        const listing = data.channelListings[index];

        return createRequiredError(toChannelPriceField(listing.id), defaultMessage);
      }

      return defaultError;
    default:
      return defaultError;
  }
};

/**
 * 验证产品变体。
 *
 * @param {ProductVariantType} data - 要验证的产品变体数据。
 * @param {IntlShape} intl - intl 对象。
 * @returns {ProductErrorWithAttributesFragment[]} 错误列表。
 */
export const validateProductVariant = (data: ProductVariantType, intl: IntlShape) => {
  const result = channelListingSchema.safeParse(data);

  const defaultMessage = intl.formatMessage({
    defaultMessage: "This field cannot be blank",
    id: "8pVWve",
  });

  return result.success === true
    ? []
    : result.error.issues.map(error => handleValidationError(error, data, defaultMessage));
};
