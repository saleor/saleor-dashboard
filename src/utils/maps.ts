import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import {
  AttributeEntityTypeEnum,
  CountryFragment,
  CountryWithCodeFragment,
  MetadataInput,
  MetadataItemFragment,
} from "@dashboard/graphql";
import { pageUrl } from "@dashboard/modeling/urls";
import { productUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { Node, SlugNode } from "@dashboard/types";
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

export function getLoadableList<T>(data: Connection<T> | undefined | null): T[] | undefined {
  // "undefined" is a loading state
  if (typeof data === "undefined") {
    return undefined;
  }

  return mapEdgesToItems(data) ?? [];
}

export function getEntityUrl({
  entityType,
  entityId,
}: {
  entityType: AttributeEntityTypeEnum | null | undefined;
  entityId: string;
}): string | undefined {
  if (!entityType || !entityId) {
    return undefined;
  }

  switch (entityType) {
    case AttributeEntityTypeEnum.CATEGORY:
      return categoryUrl(entityId);
    case AttributeEntityTypeEnum.COLLECTION:
      return collectionUrl(entityId);
    case AttributeEntityTypeEnum.PAGE:
      return pageUrl(entityId);
    case AttributeEntityTypeEnum.PRODUCT:
      return productUrl(entityId);
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      // Note: we don't know product.id here, redirect will fetch data as usual ProductVariant page
      // and update URL with replace
      return productVariantEditUrl(entityId);
    default:
      return undefined;
  }
}
