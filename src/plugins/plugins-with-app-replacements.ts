/**
 * @deprecated remove this function when all plugins are replaced with apps
 * Provides a static list of plugins IDs that are already re-implemented
 * as apps and available in the App Store.
 *
 * In the future they will be officially deprecated, but now called "with app replacements"
 *
 * Ids are part of plugins query
 * https://docs.saleor.io/api-reference/miscellaneous/queries/plugins
 */
export const getPluginsWithAppReplacementsIds = () => {
  return ["mirumee.payments.adyen", "mirumee.taxes.avalara", "mirumee.invoicing"];
};
