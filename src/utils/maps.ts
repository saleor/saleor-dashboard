import {
  CountryFragment,
  CountryWithCodeFragment,
  MetadataInput,
  MetadataItemFragment,
  PageFragment,
} from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { Node, SlugNode } from "@dashboard/types";
import { Choice } from "@saleor/macaw-ui";
import { Option } from "@saleor/macaw-ui-next";

interface Edge<T> {
  node: T;
}
interface Connection<T> {
  edges: Array<Edge<T>> | undefined | null;
}

export function mapEdgesToItems<T>(data?: Connection<T> | undefined | null): T[] | undefined {
  return data?.edges?.map(({ node }) => node);
}

export function mapCountriesToCountriesCodes(countries?: Array<Pick<CountryFragment, "code">>) {
  return countries?.map(country => country.code);
}

export function mapCountriesToChoices(countries: CountryWithCodeFragment[]) {
  return countries.map(country => ({
    label: country.country,
    value: country.code,
  }));
}

export function mapPagesToChoices(pages: Array<Pick<PageFragment, "title" | "id">>): Choice[] {
  return pages.map(page => ({
    label: page.title,
    value: page.id,
  }));
}

type ExtendedNode = Node & Record<"name", string>;

export function mapNodeToChoice<T extends ExtendedNode>(nodes: T[]): Option[];
export function mapNodeToChoice<T extends ExtendedNode | Node, K extends string>(
  nodes: T[],
  getterFn: (node: T) => K,
): Option[];

export function mapNodeToChoice<T extends ExtendedNode>(nodes: T[], getterFn?: (node: T) => any) {
  if (!nodes) {
    return [];
  }

  return nodes.map(node => ({
    label: node.name,
    value: getterFn ? getterFn(node) : node.id,
  }));
}

export function mapSlugNodeToChoice(nodes: Array<ExtendedNode & SlugNode>): Option[] {
  return mapNodeToChoice(nodes, node => node.slug);
}

export function mapMetadataItemToInput(item: MetadataItemFragment): MetadataInput {
  return {
    key: item.key,
    value: item.value,
  };
}

export function mapMultiValueNodeToChoice<T extends Record<string, any>>(
  nodes: T[] | string[],
  key?: keyof T,
): Option[] {
  if (!nodes) {
    return [];
  }

  if ((nodes as string[]).every(node => typeof node === "string")) {
    return (nodes as string[]).map(node => ({ label: node, value: node }));
  }

  if (!key) {
    return [];
  }

  return (nodes as T[]).map(node => ({ label: node[key], value: node[key] }));
}

export function mapSingleValueNodeToChoice<T extends Record<string, any>>(
  nodes: T[] | string[],
  key?: keyof T,
): Option[] {
  if (!nodes) {
    return [];
  }

  if ((nodes as string[]).every(node => typeof node === "string")) {
    return (nodes as string[]).map(node => ({ label: node, value: node }));
  }

  if (!key) {
    return [];
  }

  return (nodes as T[]).map(node => ({ label: node[key], value: node[key] }));
}

interface Person {
  firstName: string;
  lastName: string;
  id: string;
}

export function mapPersonNodeToChoice<T extends Person>(nodes: T[]): Option[] {
  if (!nodes) {
    return [];
  }

  return nodes.map(({ firstName, lastName, id }) => ({
    value: id,
    label: getFullName({ firstName, lastName }),
  }));
}

export function getLoadableList<T>(data: Connection<T> | undefined | null): T[] | undefined {
  // "undefined" is a loading state
  if (typeof data === "undefined") {
    return undefined;
  }

  return mapEdgesToItems(data) ?? [];
}
