import { DialogContentText } from "@material-ui/core";
import {
  getAttributesAfterFileAttributesUpdate,
  mergeAttributeValueDeleteErrors,
  mergeFileUploadErrors,
} from "@saleor/attributes/utils/data";
import {
  handleDeleteMultipleAttributeValues,
  handleUploadMultipleFiles,
  prepareAttributesInput,
} from "@saleor/attributes/utils/handlers";
import ActionDialog from "@saleor/components/ActionDialog";
import { AttributeInput } from "@saleor/components/Attributes";
import { WindowTitle } from "@saleor/components/WindowTitle";
import {
  DEFAULT_INITIAL_SEARCH_DATA,
  VALUES_PAGINATE_BY,
} from "@saleor/config";
import {
  AttributeErrorFragment,
  AttributeValueInput,
  PageDetailsFragment,
  PageErrorFragment,
  PageInput,
  UploadErrorFragment,
  useAttributeValueDeleteMutation,
  useFileUploadMutation,
  usePageDetailsQuery,
  usePageRemoveMutation,
  usePageUpdateMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import usePageSearch from "@saleor/searches/usePageSearch";
import useProductSearch from "@saleor/searches/useProductSearch";
import useAttributeValueSearchHandler from "@saleor/utils/handlers/attributeValueSearchHandler";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import { getParsedDataForJsonStringField } from "@saleor/utils/richText/misc";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder, maybe } from "../../misc";
import PageDetailsPage from "../components/PageDetailsPage";
import { PageData, PageSubmitData } from "../components/PageDetailsPage/form";
import { pageListUrl, pageUrl, PageUrlQueryParams } from "../urls";
import { getAttributeInputFromPage } from "../utils/data";

export interface PageDetailsProps {
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
  publicationDate: data.publicationDate,
  seo: {
    description: data.seoDescription,
    title: data.seoTitle,
  },
  slug: data.slug === "" ? null : data.slug,
  title: data.title,
});

export const PageDetails: React.FC<PageDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const pageDetails = usePageDetailsQuery({
    variables: {
      id,
      firstValues: VALUES_PAGINATE_BY,
    },
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [pageUpdate, pageUpdateOpts] = usePageUpdateMutation({});

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts,
  ] = useAttributeValueDeleteMutation({});

  const [pageRemove, pageRemoveOpts] = usePageRemoveMutation({
    onCompleted: data => {
      if (data.pageDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate(pageListUrl());
      }
    },
  });

  const handleAssignAttributeReferenceClick = (attribute: AttributeInput) =>
    navigate(
      pageUrl(id, {
        action: "assign-attribute-value",
        id: attribute.id,
      }),
    );

  const handleUpdate = async (data: PageSubmitData) => {
    let errors: Array<
      AttributeErrorFragment | UploadErrorFragment | PageErrorFragment
    > = [];

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
        input: createPageInput(
          data,
          pageDetails?.data?.page,
          updatedFileAttributes,
        ),
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

  const handleSubmit = createMetadataUpdateHandler(
    pageDetails.data?.page,
    handleUpdate,
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

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

  const attributeValues =
    mapEdgesToItems(searchAttributeValuesOpts?.data?.attribute.choices) || [];

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
        onRemove={() =>
          navigate(
            pageUrl(id, {
              action: "remove",
            }),
          )
        }
        onSubmit={handleSubmit}
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
        onCloseDialog={() => navigate(pageUrl(id))}
        onAttributeSelectBlur={searchAttributeReset}
      />
      <ActionDialog
        open={params.action === "remove"}
        confirmButtonState={pageRemoveOpts.status}
        title={intl.formatMessage({
          id: "C1luwg",
          defaultMessage: "Delete Page",
          description: "dialog header",
        })}
        onClose={() => navigate(pageUrl(id))}
        onConfirm={() => pageRemove({ variables: { id } })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            id="4B32Ba"
            defaultMessage="Are you sure you want to delete {title}?"
            description="delete page"
            values={{
              title: (
                <strong>
                  {getStringOrPlaceholder(pageDetails.data?.page?.title)}
                </strong>
              ),
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
PageDetails.displayName = "PageDetails";
export default PageDetails;
