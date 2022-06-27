import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import {
  ChoiceValue,
  SingleAutocompleteChoiceType,
} from "@saleor/components/SingleAutocompleteSelectField";
import {
  CountryWithCodeFragment,
  MetadataInput,
  MetadataItemFragment,
  SearchPagesQuery,
} from "@saleor/graphql";
import { getFullName } from "@saleor/misc";
import { Node, RelayToFlat, SlugNode, TagNode } from "@saleor/types";

interface Edge<T> {
  node: T;
}
interface Connection<T> {
  edges: Array<Edge<T>> | undefined;
}

export function mapEdgesToItems<T>(
  data: Connection<T> | undefined,
): T[] | undefined {
  return data?.edges?.map(({ node }) => node);
}

export function mapCountriesToCountriesCodes(
  countries?: CountryWithCodeFragment[],
) {
  return countries?.map(country => country.code);
}

export function mapCountriesToChoices(countries: CountryWithCodeFragment[]) {
  return countries.map(country => ({
    label: country.country,
    value: country.code,
  }));
}

export function mapPagesToChoices(
  pages: RelayToFlat<SearchPagesQuery["search"]>,
) {
  return pages.map(page => ({
    label: page.title,
    value: page.id,
  }));
}

type ExtendedNode = Node & Record<"name", string>;

export function mapNodeToChoice<T extends ExtendedNode>(
  nodes: T[],
): Array<SingleAutocompleteChoiceType<string>>;
export function mapNodeToChoice<
  T extends ExtendedNode | Node,
  K extends ChoiceValue
>(nodes: T[], getterFn: (node: T) => K): Array<SingleAutocompleteChoiceType<K>>;

export function mapNodeToChoice<T extends ExtendedNode>(
  nodes: T[],
  getterFn?: (node: T) => any,
) {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    label: node.name,
    value: getterFn ? getterFn(node) : node.id,
  }));
}

export function mapSlugNodeToChoice(
  nodes: Array<ExtendedNode & SlugNode>,
): SingleAutocompleteChoiceType[] {
  return mapNodeToChoice(nodes, node => node.slug);
}

export function mapTagNodeToChoice(
  nodes: Array<Node & TagNode>,
): SingleAutocompleteChoiceType[] {
  return mapNodeToChoice(nodes, node => node.tag);
}

export function mapMetadataItemToInput(
  item: MetadataItemFragment,
): MetadataInput {
  return {
    key: item.key,
    value: item.value,
  };
}

export function mapMultiValueNodeToChoice<T extends Record<string, any>>(
  nodes: T[] | string[],
  key?: keyof T,
): MultiAutocompleteChoiceType[] {
  if (!nodes) {
    return [];
  }

  if ((nodes as string[]).every(node => typeof node === "string")) {
    return (nodes as string[]).map(node => ({ label: node, value: node }));
  }

  return (nodes as T[]).map(node => ({ label: node[key], value: node[key] }));
}

export function mapSingleValueNodeToChoice<T extends Record<string, any>>(
  nodes: T[] | string[],
  key?: keyof T,
): SingleAutocompleteChoiceType[] {
  if (!nodes) {
    return [];
  }

  if ((nodes as string[]).every(node => typeof node === "string")) {
    return (nodes as string[]).map(node => ({ label: node, value: node }));
  }

  return (nodes as T[]).map(node => ({ label: node[key], value: node[key] }));
}

interface Person {
  firstName: string;
  lastName: string;
  id: string;
}

export function mapPersonNodeToChoice<T extends Person>(
  nodes: T[],
): SingleAutocompleteChoiceType[] {
  if (!nodes) {
    return [];
  }

  return nodes.map(({ firstName, lastName, id }) => ({
    value: id,
    label: getFullName({ firstName, lastName }),
  }));
}
