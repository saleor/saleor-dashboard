// @ts-strict-ignore
import { getAttributesAfterFileAttributesUpdate } from "@dashboard/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@dashboard/attributes/utils/handlers";
import { type AttributeInput } from "@dashboard/components/Attributes";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import {
  type PageErrorWithAttributesFragment,
  useFileUploadMutation,
  usePageCreateMutation,
  usePageTypeQuery,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { useLastCreatedEntityTypeStorage } from "@dashboard/hooks/useLastCreatedEntityTypeStorage";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { getMutationErrors } from "@dashboard/misc";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import usePageTypeSearch from "@dashboard/searches/usePageTypeSearch";
import {
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createMetadataCreateHandler from "@dashboard/utils/handlers/metadataCreateHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { useIntl } from "react-intl";
import { useLocation } from "react-router";

import { useAssignAttributeValueDialogFilterChangeHandlers } from "../../components/AssignAttributeValueDialog/useAssignAttributeValueDialogFilterChangeHandlers";
import PageDetailsPage from "../components/PageDetailsPage";
import { type PageSubmitData } from "../components/PageDetailsPage/form";
import { pageCreateUrl, type PageCreateUrlQueryParams, pageUrl } from "../urls";

interface PageCreateProps {
  id: string;
  params: PageCreateUrlQueryParams;
}

// The list URL captured as prevLocation may still carry `?action=create-page`
// from when the picker dialog was opened. Without this, navigating back to the
// list would re-open the picker.
const stripCreateActionParam = (search: string): string => {
  const params = new URLSearchParams(search);

  if (params.get("action") === "create-page") {
    params.delete("action");
  }

  const result = params.toString();

  return result ? `?${result}` : "";
};

const PageCreate = ({ params }: PageCreateProps) => {
  const navigate = useNavigator();
  const location = useLocation<{ prevLocation?: { pathname: string; search: string } }>();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});
  const [, setLastCreatedModelTypeId] = useLastCreatedEntityTypeStorage("MODEL");
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
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useCollectionSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useCategorySearch({
    variables: {
      after: DEFAULT_INITIAL_SEARCH_DATA.after,
      first: DEFAULT_INITIAL_SEARCH_DATA.first,
      filter: undefined,
    },
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
  const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];
  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});
  const [pageCreate, pageCreateOpts] = usePageCreateMutation({
    disableErrorHandling: true,
    onCompleted: data => {
      if (data.pageCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "ZwtDkP",
            defaultMessage: "Page created",
          }),
        });

        const prevLocation = location.state?.prevLocation;

        navigate(pageUrl(data.pageCreate.page.id), {
          // Pass-through state, to preserve where view was opened from
          // So "back" button can properly redirect to model list with type of this model.
          // Strip `action=create-page` from the captured search so the model-type
          // picker dialog doesn't re-open when the user navigates back to the list.
          state: prevLocation
            ? {
                prevLocation: {
                  ...prevLocation,
                  search: stripCreateActionParam(prevLocation.search),
                },
              }
            : undefined,
        });
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
          publishedAt: formData.publishedAt,
          seo: {
            description: formData.seoDescription,
            title: formData.seoTitle,
          },
          slug: formData.slug === "" ? null : formData.slug,
          title: formData.title,
        },
      },
    });

    const mutationErrors = getMutationErrors(result);

    if (mutationErrors.length === 0 && formData.pageType?.id) {
      setLastCreatedModelTypeId(formData.pageType.id);
    }

    return {
      id: result.data.pageCreate.page?.id || null,
      errors: mutationErrors,
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
        ...params,
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );
  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? selectedPageType?.pageType.attributes?.find(a => a.id === params.id)
      : undefined;
  const fetchMorePageTypes = {
    hasMore: searchPageTypesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchPageTypesOpts.loading,
    onFetchMore: loadMorePageTypes,
  };
  const {
    loadMore: loadMoreProducts,
    search: searchProducts,
    result: searchProductsOpts,
  } = useReferenceProductSearch(refAttr);

  const {
    loadMore: loadMorePages,
    search: searchPages,
    result: searchPagesOpts,
  } = useReferencePageSearch(refAttr);

  const onFilterChange = useAssignAttributeValueDialogFilterChangeHandlers({
    refetchProducts: searchProductsOpts.refetch,
    refetchPages: searchPagesOpts.refetch,
    refetchCategories: searchCategoriesOpts.refetch,
    refetchCollections: searchCollectionsOpts.refetch,
  });

  const fetchMoreReferenceCategories = {
    hasMore: searchCategoriesOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCategoriesOpts.loading,
    onFetchMore: loadMoreCategories,
  };
  const fetchMoreReferenceCollections = {
    hasMore: searchCollectionsOpts.data?.search?.pageInfo?.hasNextPage,
    loading: searchCollectionsOpts.loading,
    onFetchMore: loadMoreCollections,
  };
  const fetchMoreAttributeValues = {
    hasMore: !!searchAttributeValuesOpts.data?.attribute?.choices?.pageInfo?.hasNextPage,
    loading: !!searchAttributeValuesOpts.loading,
    onFetchMore: loadMoreAttributeValues,
  };
  const fetchMoreReferencePages = getSearchFetchMoreProps(searchPagesOpts, loadMorePages);
  const fetchMoreReferenceProducts = getSearchFetchMoreProps(searchProductsOpts, loadMoreProducts);
  const errors = getMutationErrors(pageCreateOpts) as PageErrorWithAttributesFragment[];

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
        assignReferencesAttributeId={params.action === "assign-attribute-value" && params.id}
        onAssignReferencesClick={handleAssignAttributeReferenceClick}
        referencePages={mapEdgesToItems(searchPagesOpts?.data?.search) || []}
        referenceProducts={mapEdgesToItems(searchProductsOpts?.data?.search) || []}
        referenceCategories={mapEdgesToItems(searchCategoriesOpts?.data?.search) || []}
        referenceCollections={mapEdgesToItems(searchCollectionsOpts?.data?.search) || []}
        fetchReferencePages={searchPages}
        fetchMoreReferencePages={fetchMoreReferencePages}
        fetchReferenceProducts={searchProducts}
        fetchMoreReferenceProducts={fetchMoreReferenceProducts}
        fetchReferenceCategories={searchCategories}
        fetchMoreReferenceCategories={fetchMoreReferenceCategories}
        fetchReferenceCollections={searchCollections}
        fetchMoreReferenceCollections={fetchMoreReferenceCollections}
        fetchAttributeValues={searchAttributeValues}
        fetchMoreAttributeValues={fetchMoreAttributeValues}
        onCloseDialog={() => navigate(pageCreateUrl({ ...params, action: undefined }))}
        selectedPageType={selectedPageType?.pageType}
        onSelectPageType={handleSelectPageTypeId}
        onAttributeSelectBlur={searchAttributeReset}
        onFilterChange={onFilterChange}
      />
    </>
  );
};

PageCreate.displayName = "PageCreate";
export default PageCreate;
