// @ts-strict-ignore
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@dashboard/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@dashboard/attributes/utils/handlers";
import { getReferenceTypeConstraints } from "@dashboard/components/AssignAttributeValueDialog/getReferenceTypeConstraints";
import { getReferenceWhereConstraints } from "@dashboard/components/AssignAttributeValueDialog/mergeReferenceTypeWhereConstraints";
import { type AttributeInput } from "@dashboard/components/Attributes";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA, VALUES_PAGINATE_BY } from "@dashboard/config";
import { useRegisterEntityRefresh } from "@dashboard/extensions/entity-refresh";
import {
  type AttributeErrorFragment,
  type AttributeValueInput,
  type PageDetailsFragment,
  type PageErrorFragment,
  type PageInput,
  type UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  usePageDetailsQuery,
  usePageRemoveMutation,
  usePageUpdateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import {
  useReferenceCategorySearch,
  useReferenceCollectionSearch,
  useReferencePageSearch,
  useReferenceProductSearch,
} from "@dashboard/searches/useReferenceSearch";
import useAttributeValueSearchHandler from "@dashboard/utils/handlers/attributeValueSearchHandler";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getParsedDataForJsonStringField } from "@dashboard/utils/richText/misc";
import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useAssignAttributeValueDialogFilterChangeHandlers } from "../../components/AssignAttributeValueDialog/useAssignAttributeValueDialogFilterChangeHandlers";
import { getStringOrPlaceholder, maybe } from "../../misc";
import { PageDeleteDialog } from "../components/PageDeleteDialog/PageDeleteDialog";
import PageDetailsPage from "../components/PageDetailsPage";
import { type PageData, type PageSubmitData } from "../components/PageDetailsPage/form";
import { PageMetadataDialog } from "../components/PageMetadataDialog/PageMetadataDialog";
import { pageListUrl, pageUrl, type PageUrlQueryParams } from "../urls";
import { getAttributeInputFromPage } from "../utils/data";

interface PageDetailsProps {
  id: string;
  params: PageUrlQueryParams;
}

const createPageInput = (
  data: PageData,
  page: PageDetailsFragment,
  updatedFileAttributes: AttributeValueInput[],
): PageInput => ({
  attributes: prepareAttributesInput({
    attributes: data.attributes,
    prevAttributes: getAttributeInputFromPage(page),
    updatedFileAttributes,
  }),
  content: getParsedDataForJsonStringField(data.content),
  isPublished: data.isPublished,
  publishedAt: data.publishedAt,
  seo: {
    description: data.seoDescription,
    title: data.seoTitle,
  },
  slug: data.slug === "" ? null : data.slug,
  title: data.title,
});

const PageDetails = ({ id, params }: PageDetailsProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [openModal, closeModal] = createDialogActionHandlers(
    navigate,
    dialogParams => pageUrl(id, dialogParams),
    params,
  );
  const pageDetails = usePageDetailsQuery({
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY,
    },
  });

  useRegisterEntityRefresh(pageDetails.refetch);

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});
  const [pageUpdate, pageUpdateOpts] = usePageUpdateMutation({
    disableErrorHandling: true,
  });
  const [deleteAttributeValue, deleteAttributeValueOpts] = useAttributeValueDeleteMutation({});
  const [pageRemove, pageRemoveOpts] = usePageRemoveMutation({
    onCompleted: data => {
      if (data.pageDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({ id: "EAGfdH", defaultMessage: "Page updated" }),
        });
        navigate(pageListUrl());
      }
    },
  });
  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    openModal("assign-attribute-value", { id: attribute.id });
  const handleUpdate = async (data: PageSubmitData) => {
    let errors: Array<AttributeErrorFragment | UploadErrorFragment | PageErrorFragment> = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables }),
    );
    const deleteAttributeValuesResult = await handleDeleteMultipleAttributeValues(
      data.attributesWithNewFileValue,
      pageDetails?.data?.page?.attributes,
      variables => deleteAttributeValue({ variables }),
    );
    const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
      data.attributesWithNewFileValue,
      uploadFilesResult,
    );
    const updateResult = await pageUpdate({
      variables: {
        id,
        input: createPageInput(data, pageDetails?.data?.page, updatedFileAttributes),
        firstValues: VALUES_PAGINATE_BY,
      },
    });

    errors = [
      ...errors,
      ...mergeFileUploadErrors(uploadFilesResult),
      ...mergeAttributeValueDeleteErrors(deleteAttributeValuesResult),
      ...updateResult.data.pageUpdate.errors,
    ];

    return errors;
  };
  const refAttr =
    params.action === "assign-attribute-value" && params.id
      ? pageDetails?.data?.page?.attributes?.find(a => a.attribute.id === params.id)?.attribute
      : undefined;

  // Extract productType and pageType constraints from reference attribute for modal filter
  const initialConstraints = useMemo(
    () => getReferenceTypeConstraints(refAttr?.referenceTypes),
    [refAttr?.referenceTypes],
  );
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
  const {
    loadMore: loadMoreCollections,
    search: searchCollections,
    result: searchCollectionsOpts,
  } = useReferenceCollectionSearch(refAttr);
  const {
    loadMore: loadMoreCategories,
    search: searchCategories,
    result: searchCategoriesOpts,
  } = useReferenceCategorySearch(refAttr);
  const {
    loadMore: loadMoreAttributeValues,
    search: searchAttributeValues,
    result: searchAttributeValuesOpts,
    reset: searchAttributeReset,
  } = useAttributeValueSearchHandler(DEFAULT_INITIAL_SEARCH_DATA);
  const attributeValues = mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];
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

  const onFilterChange = useAssignAttributeValueDialogFilterChangeHandlers({
    refetchProducts: searchProductsOpts.refetch,
    refetchPages: searchPagesOpts.refetch,
    refetchCategories: searchCategoriesOpts.refetch,
    refetchCollections: searchCollectionsOpts.refetch,
    referenceWhereConstraints: getReferenceWhereConstraints(initialConstraints),
  });

  return (
    <>
      <WindowTitle title={maybe(() => pageDetails.data.page.title)} />
      <PageDetailsPage
        loading={
          pageDetails.loading ||
          pageUpdateOpts.loading ||
          uploadFileOpts.loading ||
          deleteAttributeValueOpts.loading
        }
        errors={pageUpdateOpts.data?.pageUpdate.errors || []}
        saveButtonBarState={pageUpdateOpts.status}
        page={pageDetails.data?.page}
        attributeValues={attributeValues}
        onRemove={() => openModal("remove", { id: undefined })}
        onShowMetadata={() => openModal("view-metadata", { id: undefined })}
        onSubmit={handleUpdate}
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
        onCloseDialog={closeModal}
        onAttributeSelectBlur={searchAttributeReset}
        onFilterChange={onFilterChange}
        initialConstraints={initialConstraints}
      />
      <PageMetadataDialog
        open={params.action === "view-metadata" && !!pageDetails.data?.page}
        onClose={closeModal}
        page={pageDetails.data?.page}
        refetchPage={pageDetails.refetch}
      />
      <PageDeleteDialog
        confirmButtonState={pageRemoveOpts.status}
        onClose={closeModal}
        onConfirm={() => pageRemove({ variables: { id } })}
        open={params.action === "remove"}
        title={
          <FormattedMessage
            description="delete model"
            id="knO/IN"
            defaultMessage="Are you sure you want to delete {title}?"
            values={{
              title: <strong>{getStringOrPlaceholder(pageDetails.data?.page?.title)}</strong>,
            }}
          />
        }
      />
    </>
  );
};

PageDetails.displayName = "PageDetails";
export default PageDetails;
