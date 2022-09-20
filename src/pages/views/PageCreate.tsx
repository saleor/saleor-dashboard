import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@saleor/attributes/utils/handlers";
import { AttributeInput } from "@saleor/components/Attributes";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  VALUES_PAGINATE_BY,
} from "@saleor/config";
import {
  PageErrorWithAttributesFragment,
  useFileUploadMutation,
  usePageCreateMutation,
  usePageTypeQuery,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationErrors } from "@saleor/misc";
import usePageSearch from "@saleor/searches/usePageSearch";
import usePageTypeSearch from "@saleor/searches/usePageTypeSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import React from "react";
import { useIntl } from "react-intl";

import PageDetailsPage from "../components/PageDetailsPage";
import { PageSubmitData } from "../components/PageDetailsPage/form";
import { pageCreateUrl, PageCreateUrlQueryParams, pageUrl } from "../urls";

export interface PageCreateProps {
  id: string;
  params: PageCreateUrlQueryParams;
}

export const PageCreate: React.FC<PageCreateProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const selectedPageTypeId = params["page-type-id"];

  const handleSelectPageTypeId = (pageTypeId: string) =>
    navigate(
      pageCreateUrl({
        ...params,
        "page-type-id": pageTypeId,
      }),
    );

  const {
    loadMore: loadMorePageTypes,
    search: searchPageTypes,
    result: searchPageTypesOpts,
  } = usePageTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = usePageSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useProductSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);

  const { data: selectedPageType } = usePageTypeQuery({
    variables: {
      id: selectedPageTypeId,
      firstValues: VALUES_PAGINATE_BY,
    },
    skip: !selectedPageTypeId,
  });

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [pageCreate, pageCreateOpts] = usePageCreateMutation({
    onCompleted: data => {
      if (data.pageCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "JMbFNo",
            defaultMessage: "Successfully created new page",
          }),
        });
        navigate(pageUrl(data.pageCreate.page.id));
      }
    },
  });

  const handleCreate = async (formData: PageSubmitData) => {
    const uploadFilesResult = await handleUploadMultipleFiles(
      formData.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );

    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      formData.attributesWithNewFileValue,
      uploadFilesResult,
    );

    const result = await pageCreate({
      variables: {
        input: {
          attributes: prepareAttributesInput({
            attributes: formData.attributes,
            prevAttributes: null,
            updatedFileAttributes,
          }),
          content: getParsedDataForJsonStringField(formData.content),
          isPublished: formData.isPublished,
          pageType: formData.pageType?.id,
          publicationDate: formData.publicationDate,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle,
          },
          slug: formData.slug === "" ? null : formData.slug,
          title: formData.title,
        },
      },
    });

    return {
      id: result.data.pageCreate.page?.id || null,
      errors: getMutationErrors(result),
    };
  };

  const handleSubmit = createMetadataCreateHandler(
    handleCreate,
    updateMetadata,
    updatePrivateMetadata,
  );

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      pageCreateUrl({
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );

  const fetchMorePageTypes = {
    hasMore: searchPageTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchPageTypesOpts.loading,
    onFetchMore: loadMorePageTypes,
  };
  const fetchMoreReferencePages = {
    hasMore: searchPagesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchPagesOpts.loading,
    onFetchMore: loadMorePages,
  };
  const fetchMoreReferenceProducts = {
    hasMore: searchProductsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchProductsOpts.loading,
    onFetchMore: loadMoreProducts,
  };
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo
      ?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };

  const errors = getMutationErrors(
    pageCreateOpts,
  ) as PageErrorWithAttributesFragment[];

  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "mX7zJJ",
          defaultMessage: "Create Page",
          description: "header",
        })}
      />
      <PageDetailsPage
        loading={pageCreateOpts.loading || uploadFileOpts.loading}
        errors={errors}
        saveButtonBarState={pageCreateOpts.status}
        page={null}
        attributeValues={attributeValues}
        pageTypes={mapEdgesToItems(searchPageTypesOpts?.data?.search) || []}
        onRemove={() => undefined}
        onSubmit={handleSubmit}
        fetchPageTypes={searchPageTypes}
        fetchMorePageTypes={fetchMorePageTypes}
        assignReferencesAttributeId={
          params.action === "assign-attribute-value" && params.id
        }
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={
          mapEdgesToItems(searchProductsOpts?.data?.search) || []
        }
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(pageCreateUrl())}
        selectedPageType={selectedPageType?.pageType}
        onSelectPageType={handleSelectPageTypeId}
        onAttributeSelectBlur={searchAttributeReset}
      />
    </>
  );
};
PageCreate.displayName = "PageCreate";
export default PageCreate;
