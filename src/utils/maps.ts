import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import {
  ChoiceValue,
  SingleAutocompleteChoiceType
} from "@saleor/components/SingleAutocompleteSelectField";
import { MetadataItem } from "@saleor/fragments/types/MetadataItem";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { Node, SlugNode } from "@saleor/types";
import { MetadataInput } from "@saleor/types/globalTypes";

interface Edge<T> {
  node: T;
}
interface Connection<T> {
  edges: Array<Edge<T>> | undefined;
}

export function mapEdgesToItems<T>(
  data: Connection<T> | undefined
): T[] | undefined {
  return data?.edges?.map(({ node }) => node);
}

export function mapCountriesToChoices(countries: ShopInfo_shop_countries[]) {
  return countries.map(country => ({
    label: country.country,
    value: country.code
  }));
}

export function mapPagesToChoices(pages: SearchPages_search_edges_node[]) {
  return pages.map(page => ({
    label: page.title,
    value: page.id
  }));
}

type ExtendedNode = Node & Record<"name", string>;
export function mapNodeToChoice<T extends ExtendedNode>(
  nodes: T[]
): Array<SingleAutocompleteChoiceType<string>>;
export function mapNodeToChoice<T extends ExtendedNode, K extends ChoiceValue>(
  nodes: T[],
  getterFn: (node: T) => K
): Array<SingleAutocompleteChoiceType<K>>;
export function mapNodeToChoice<T extends ExtendedNode>(
  nodes: T[],
  getterFn?: (node: T) => any
) {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    label: node.name,
    value: getterFn ? getterFn(node) : node.id
  }));
}

export function mapSlugNodeToChoice(
  nodes: Array<ExtendedNode & SlugNode>
): SingleAutocompleteChoiceType[] {
  return mapNodeToChoice(nodes, nodes => nodes.slug);
}

export function mapMetadataItemToInput(item: MetadataItem): MetadataInput {
  return {
    key: item.key,
    value: item.value
  };
}
