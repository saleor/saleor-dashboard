import { type AttributeListUrlSortField } from "@dashboard/attributes/urls";
import { filterAssignedAttributes } from "@dashboard/attributes/utils/filterAssignedAttributes";
import {
  type AttributeAssignedListFragment,
  type AttributeFilterInput,
  usePageTypeAssignedAttributesForListQuery,
  useProductTypeAssignedAttributesForListQuery,
} from "@dashboard/graphql";
import { type Sort } from "@dashboard/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type AssignedAttributeTypeKind = "product" | "model";

const mergeAttributesById = (
  attributeLists: AttributeAssignedListFragment[][],
): AttributeAssignedListFragment[] => {
  const byId = new Map<string, AttributeAssignedListFragment>();

  attributeLists.forEach(attributes => {
    attributes.forEach(attribute => {
      byId.set(attribute.id, attribute);
    });
  });

  return Array.from(byId.values());
};

interface TypeAttributesFetcherProps {
  typeId: string;
  onData: (
    typeId: string,
    attributes: AttributeAssignedListFragment[],
    loading: boolean,
    refetch: () => Promise<unknown>,
  ) => void;
}

const PageTypeAttributesFetcher = ({ typeId, onData }: TypeAttributesFetcherProps) => {
  const { data, loading, refetch } = usePageTypeAssignedAttributesForListQuery({
    fetchPolicy: "cache-first",
    variables: { id: typeId },
  });

  const attributes = useMemo(() => data?.pageType?.attributes ?? [], [data?.pageType?.attributes]);

  useEffect(() => {
    onData(typeId, attributes, loading, refetch);
  }, [attributes, loading, onData, refetch, typeId]);

  return null;
};

const ProductTypeAttributesFetcher = ({ typeId, onData }: TypeAttributesFetcherProps) => {
  const { data, loading, refetch } = useProductTypeAssignedAttributesForListQuery({
    fetchPolicy: "cache-first",
    variables: { id: typeId },
  });

  const attributes = useMemo(() => {
    const productType = data?.productType;

    if (!productType) {
      return [];
    }

    return mergeAttributesById([
      productType.productAttributes ?? [],
      productType.variantAttributes ?? [],
    ]);
  }, [data?.productType]);

  useEffect(() => {
    onData(typeId, attributes, loading, refetch);
  }, [attributes, loading, onData, refetch, typeId]);

  return null;
};

interface UseAssignedTypeAttributesArgs {
  kind: AssignedAttributeTypeKind;
  typeIds: string[];
  search: string | undefined;
  sort: Sort<AttributeListUrlSortField>;
  expressionFilters: AttributeFilterInput;
}

export const useAssignedTypeAttributes = ({
  kind,
  typeIds,
  search,
  sort,
  expressionFilters,
}: UseAssignedTypeAttributesArgs) => {
  const [attributesByType, setAttributesByType] = useState<
    Record<string, AttributeAssignedListFragment[]>
  >({});
  const [loadingByType, setLoadingByType] = useState<Record<string, boolean>>({});
  const refetchByType = useRef<Record<string, () => Promise<unknown>>>({});

  const listExpressionFilters = useMemo(() => {
    const {
      type: _type,
      search: _search,
      isVariantOnly: _isVariantOnly,
      ...rest
    } = expressionFilters;

    return rest;
  }, [expressionFilters]);

  const handleTypeData = useCallback(
    (
      typeId: string,
      attributes: AttributeAssignedListFragment[],
      loading: boolean,
      refetch: () => Promise<unknown>,
    ) => {
      refetchByType.current[typeId] = refetch;

      setAttributesByType(prev => {
        if (prev[typeId] === attributes) {
          return prev;
        }

        return { ...prev, [typeId]: attributes };
      });
      setLoadingByType(prev => {
        if (prev[typeId] === loading) {
          return prev;
        }

        return { ...prev, [typeId]: loading };
      });
    },
    [],
  );

  const refetch = useCallback(async () => {
    await Promise.all(typeIds.map(typeId => refetchByType.current[typeId]?.()));
  }, [typeIds]);

  const assignedAttributes = useMemo(
    () => mergeAttributesById(typeIds.map(typeId => attributesByType[typeId] ?? [])),
    [attributesByType, typeIds],
  );

  const attributes = useMemo(
    () => filterAssignedAttributes(assignedAttributes, search, sort, listExpressionFilters),
    [assignedAttributes, listExpressionFilters, search, sort],
  );

  const loading = typeIds.length > 0 && typeIds.some(typeId => loadingByType[typeId] ?? true);

  const TypeFetcher = kind === "product" ? ProductTypeAttributesFetcher : PageTypeAttributesFetcher;

  const fetchers = typeIds.map(typeId => (
    <TypeFetcher key={typeId} typeId={typeId} onData={handleTypeData} />
  ));

  return {
    attributes,
    loading,
    refetch,
    fetchers,
  };
};
