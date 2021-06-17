import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import { MetadataItem } from "@saleor/fragments/types/MetadataItem";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { Node, SlugNode } from "@saleor/types";
import { MetadataInput } from "@saleor/types/globalTypes";

interface EdgesType<T> {
  edges?: Array<{ node: T }>;
}

export function mapEdgesToItems<T>(data?: EdgesType<T>): T[] {
  if (!data || !data?.edges) {
    return [];
  }

  return data.edges.map(({ node }) => node);
}

export function mapCountriesToChoices(
  countries: ShopInfo_shop_countries[]
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  return countries.map(country => ({
    label: country.country,
    value: country.code
  }));
}

export function mapPagesToChoices(
  pages: SearchPages_search_edges_node[]
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  return pages.map(page => ({
    label: page.title,
    value: page.id
  }));
}

export function mapNodeToChoice(
  nodes: Array<Node & Record<"name", string>>
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    label: node.name,
    value: node.id
  }));
}

export function mapSlugNodeToChoice(
  nodes: Array<SlugNode & Record<"name", string>>
): Array<SingleAutocompleteChoiceType | MultiAutocompleteChoiceType> {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    label: node.name,
    value: node.slug
  }));
}

export function mapMetadataItemToInput(item: MetadataItem): MetadataInput {
  return {
    key: item.key,
    value: item.value
  };
}
