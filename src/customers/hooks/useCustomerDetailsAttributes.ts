import { useApolloClient } from "@apollo/client";
import {
  getAttributesDisplayData,
  getRichTextAttributesFromMap,
  getRichTextDataFromAttributes,
  mergeAttributes,
  type ReferenceEntitiesSearch,
} from "@dashboard/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceAdditionalDataHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler,
} from "@dashboard/attributes/utils/handlers";
import { type AttributeInput } from "@dashboard/components/Attributes";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  type CustomerDetailsQuery,
  CustomerTypeAttributesForCustomerDocument,
} from "@dashboard/graphql";
import useFormset, { type FormsetData } from "@dashboard/hooks/useFormset";
import { type FetchMoreProps } from "@dashboard/types";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMultipleRichText } from "@dashboard/utils/richText/useMultipleRichText";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  getAttributeInputFromCustomer,
  getAttributeInputFromCustomerType,
} from "../utils/customerAttributes";

export interface CustomerDetailsAttributeSubmitData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
}

interface UseCustomerDetailsAttributesOpts {
  assignReferencesAttributeId?: string;
  customer: CustomerDetailsQuery["user"];
  fetchMoreReferenceCategories?: FetchMoreProps;
  fetchMoreReferenceCollections?: FetchMoreProps;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchReferenceCategories?: (data: string) => void;
  fetchReferenceCollections?: (data: string) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  referenceCategories?: ReferenceEntitiesSearch["categories"];
  referenceCollections?: ReferenceEntitiesSearch["collections"];
  referencePages?: ReferenceEntitiesSearch["pages"];
  referenceProducts?: ReferenceEntitiesSearch["products"];
  triggerChange: () => void;
}

export const useCustomerDetailsAttributes = ({
  assignReferencesAttributeId,
  customer,
  fetchMoreReferenceCategories,
  fetchMoreReferenceCollections,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchReferenceCategories,
  fetchReferenceCollections,
  fetchReferencePages,
  fetchReferenceProducts,
  referenceCategories = [],
  referenceCollections = [],
  referencePages = [],
  referenceProducts = [],
  triggerChange,
}: UseCustomerDetailsAttributesOpts) => {
  const attributes = useFormset(getAttributeInputFromCustomer(customer));
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const [richTextDirty, setRichTextDirty] = useState(false);
  const { getters: attributeRichTextGetters, getValues: getAttributeRichTextValues } =
    useMultipleRichText({
      initial: getRichTextDataFromAttributes(attributes.data),
      triggerChange: () => {
        setRichTextDirty(true);
        triggerChange();
      },
    });
  const client = useApolloClient();
  const [typeAttributesLoading, setTypeAttributesLoading] = useState(false);
  const typeChangeRequestId = useRef(0);
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

  const handleTypeChange = useCallback(
    async (typeId: string) => {
      const requestId = ++typeChangeRequestId.current;

      triggerChange();
      setTypeAttributesLoading(true);

      try {
        const result = await client.query({
          query: CustomerTypeAttributesForCustomerDocument,
          variables: { id: typeId },
        });

        if (requestId !== typeChangeRequestId.current) {
          return;
        }

        attributes.set(
          getAttributeInputFromCustomerType({
            assignedAttributes: customer?.assignedAttributes ?? [],
            customerType: result.data.customerType,
            previousAttributes: attributes.data,
          }),
        );
      } finally {
        if (requestId === typeChangeRequestId.current) {
          setTypeAttributesLoading(false);
        }
      }
    },
    [attributes, client, customer?.assignedAttributes, triggerChange],
  );

  const getSubmitData = useCallback(async (): Promise<CustomerDetailsAttributeSubmitData> => {
    return {
      attributes: mergeAttributes(
        attributes.data,
        getRichTextAttributesFromMap(attributes.data, await getAttributeRichTextValues()),
      ),
      attributesWithNewFileValue: attributesWithNewFileValue.data,
    };
  }, [attributes.data, attributesWithNewFileValue.data, getAttributeRichTextValues]);

  const isDirty = useMemo(() => {
    if (richTextDirty || attributesWithNewFileValue.data.length > 0) {
      return true;
    }

    const current = attributes.data.map(attribute => ({
      id: attribute.id,
      value: attribute.value,
    }));
    const initial = getAttributeInputFromCustomer(customer).map(attribute => ({
      id: attribute.id,
      value: attribute.value,
    }));

    return JSON.stringify(current) !== JSON.stringify(initial);
  }, [attributes.data, attributesWithNewFileValue.data, customer, richTextDirty]);

  const displayedAttributes: AttributeInput[] = useMemo(
    () =>
      getAttributesDisplayData(attributes.data, attributesWithNewFileValue.data, {
        categories: referenceCategories,
        collections: referenceCollections,
        pages: referencePages,
        products: referenceProducts,
      }) as AttributeInput[],
    [
      attributes.data,
      attributesWithNewFileValue.data,
      referenceCategories,
      referenceCollections,
      referencePages,
      referenceProducts,
    ],
  );

  return {
    attributeRichTextGetters,
    attributes: displayedAttributes,
    attributeValues: mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute?.choices) || [],
    fetchAttributeValues: searchAttributeValues,
    fetchMoreAttributeValues: {
      hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
      loading: searchAttributeValuesOpts.loading,
      onFetchMore: loadMoreAttributeValues,
    },
    getSubmitData,
    handleTypeChange,
    isDirty,
    handlers: {
      fetchMoreReferences: createFetchMoreReferencesHandler(
        attributes.data,
        assignReferencesAttributeId ?? "",
        fetchMoreReferencePages,
        fetchMoreReferenceProducts,
        fetchMoreReferenceCategories,
        fetchMoreReferenceCollections,
      ),
      fetchReferences: createFetchReferencesHandler(
        attributes.data,
        assignReferencesAttributeId ?? "",
        fetchReferencePages,
        fetchReferenceProducts,
        fetchReferenceCategories,
        fetchReferenceCollections,
      ),
      onAttributeSelectBlur: searchAttributeReset,
      onChange: createAttributeChangeHandler(attributes, triggerChange),
      onFileChange: createAttributeFileChangeHandler(
        attributes.change,
        attributesWithNewFileValue.data,
        attributesWithNewFileValue.add,
        attributesWithNewFileValue.change,
        triggerChange,
      ),
      onMultiChange: createAttributeMultiChangeHandler(
        attributes.change,
        attributes.data,
        triggerChange,
      ),
      selectAttributeReference: createAttributeReferenceChangeHandler(attributes, triggerChange),
      selectAttributeReferenceAdditionalData: createAttributeReferenceAdditionalDataHandler(
        attributes,
        triggerChange,
      ),
      onReferencesReorder: createAttributeValueReorderHandler(
        attributes.change,
        attributes.data,
        triggerChange,
      ),
    },
    typeAttributesLoading,
  };
};
