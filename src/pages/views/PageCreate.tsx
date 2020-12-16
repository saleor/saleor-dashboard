import { getAttributesAfterFileAttributesUpdate } from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { useFileUploadMutation } from "@saleor/files/mutations";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import usePageTypeSearch from "@saleor/searches/usePageTypeSearch";
import createMetadataCreateHandler from "@saleor/utils/handlers/metadataCreateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { useIntl } from "react-intl";

import PageDetailsPage from "../components/PageDetailsPage";
import { PageSubmitData } from "../components/PageDetailsPage/form";
import { TypedPageCreate } from "../mutations";
import { PageCreate as PageCreateData } from "../types/PageCreate";
import { pageListUrl, pageUrl } from "../urls";

export interface PageCreateProps {
  id: string;
}

export const PageCreate: React.FC<PageCreateProps> = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const {
    loadMore: loadMorePageTypes,
    search: searchPageTypes,
    result: searchPageTypesOpts
  } = usePageTypeSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const handlePageCreate = (data: PageCreateData) => {
    if (data.pageCreate.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({
          defaultMessage: "Successfully created new page"
        })
      });
      navigate(pageUrl(data.pageCreate.page.id));
    }
  };

  return (
    <TypedPageCreate onCompleted={handlePageCreate}>
      {(pageCreate, pageCreateOpts) => {
        const handleCreate = async (formData: PageSubmitData) => {
          const uploadFilesResult = await handleUploadMultipleFiles(
            formData.attributesWithNewFileValue,
            variables => uploadFile({ variables })
          );

          const updatedFileAttributes = getAttributesAfterFileAttributesUpdate(
            formData.attributesWithNewFileValue,
            uploadFilesResult
          );

          const result = await pageCreate({
            variables: {
              input: {
                attributes: prepareAttributesInput({
                  attributes: formData.attributes,
                  updatedFileAttributes
                }),
                contentJson: JSON.stringify(formData.content),
                isPublished: formData.isPublished,
                pageType: formData.pageType,
                publicationDate: formData.publicationDate,
                seo: {
                  description: formData.seoDescription,
                  title: formData.seoTitle
                },
                slug: formData.slug === "" ? null : formData.slug,
                title: formData.title
              }
            }
          });

          return result.data.pageCreate.page?.id || null;
        };
        const handleSubmit = createMetadataCreateHandler(
          handleCreate,
          updateMetadata,
          updatePrivateMetadata
        );

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create Page",
                description: "header"
              })}
            />
            <PageDetailsPage
              loading={pageCreateOpts.loading || uploadFileOpts.loading}
              errors={pageCreateOpts.data?.pageCreate.errors || []}
              saveButtonBarState={pageCreateOpts.status}
              page={null}
              pageTypes={searchPageTypesOpts.data?.search.edges.map(
                edge => edge.node
              )}
              onBack={() => navigate(pageListUrl())}
              onRemove={() => undefined}
              onSubmit={handleSubmit}
              fetchPageTypes={searchPageTypes}
              fetchMorePageTypes={{
                hasMore: searchPageTypesOpts.data?.search.pageInfo.hasNextPage,
                loading: searchPageTypesOpts.loading,
                onFetchMore: loadMorePageTypes
              }}
            />
          </>
        );
      }}
    </TypedPageCreate>
  );
};
PageCreate.displayName = "PageCreate";
export default PageCreate;
