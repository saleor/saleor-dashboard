import {
  type FilterContainer,
  FilterElement,
} from "@dashboard/components/ConditionalFilter/FilterElement";
import { Condition } from "@dashboard/components/ConditionalFilter/FilterElement/Condition";
import {
  type ConditionItem,
  ConditionOptions,
} from "@dashboard/components/ConditionalFilter/FilterElement/ConditionOptions";
import { ConditionSelected } from "@dashboard/components/ConditionalFilter/FilterElement/ConditionSelected";
import { ExpressionValue } from "@dashboard/components/ConditionalFilter/FilterElement/FilterElement";
import { prepareStructure } from "@dashboard/components/ConditionalFilter/ValueProvider/utils";
import { createChannelFilterElement } from "@dashboard/products/components/ProductListDatagrid/utils";
import { productListPath } from "@dashboard/products/urls";
import { stringify } from "qs";

export type ChannelCatalogFilterChannel = {
  id: string;
  name: string;
  slug: string;
};

const createChannelCatalogChannelFilterElement = (channel: ChannelCatalogFilterChannel) => {
  const channelFilterElement = createChannelFilterElement();
  const condition = channelFilterElement.condition.options[0];

  channelFilterElement.updateCondition(condition);
  channelFilterElement.updateRightOperator({
    label: channel.name,
    slug: channel.slug,
    value: channel.id,
  });

  return channelFilterElement;
};

const createIsPublishedFilterElement = (isPublished: boolean) => {
  const expressionValue = new ExpressionValue("isPublished", "Is published", "isPublished");
  const conditionOptions = ConditionOptions.fromStaticElementName("isPublished");
  const conditionItem: ConditionItem = { type: "select", label: "is", value: "input-1" };
  const conditionSelected = ConditionSelected.fromConditionItemAndValue(
    conditionItem,
    isPublished ? "true" : "false",
  );
  const condition = new Condition(conditionOptions, conditionSelected, false);

  return new FilterElement(expressionValue, condition, false);
};

const productListUrlWithCatalogFilters = (
  channel: ChannelCatalogFilterChannel,
  isPublished?: boolean,
) => {
  const filters: FilterContainer = [createChannelCatalogChannelFilterElement(channel)];

  if (isPublished !== undefined) {
    filters.push("AND", createIsPublishedFilterElement(isPublished));
  }

  const queryParams = prepareStructure(filters);

  // Keep the trailing slash on productListPath (url-join strips it and can break exact routes).
  return productListPath + "?" + stringify(queryParams);
};

export const productListUrlWithChannelCatalogFilters = ({
  channel,
  isPublished,
}: {
  channel: ChannelCatalogFilterChannel;
  isPublished?: boolean;
}) => productListUrlWithCatalogFilters(channel, isPublished);

/** Full shop catalog — products are not auto-added to a channel. */
export const productListUrlForAllProducts = () => productListPath;
