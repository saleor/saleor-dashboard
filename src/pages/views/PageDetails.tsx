import DialogContentText from "@material-ui/core/DialogContentText";
import { useAttributeValueDeleteMutation } from "@saleor/attributes/mutations";
import ActionDialog from "@saleor/components/ActionDialog";
import { WindowTitle } from "@saleor/components/WindowTitle";
import { useFileUploadMutation } from "@saleor/files/mutations";
import { AttributeErrorFragment } from "@saleor/fragments/types/AttributeErrorFragment";
import { PageErrorFragment } from "@saleor/fragments/types/PageErrorFragment";
import { UploadErrorFragment } from "@saleor/fragments/types/UploadErrorFragment";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import createMetadataUpdateHandler from "@saleor/utils/handlers/metadataUpdateHandler";
import {
  useMetadataUpdate,
  usePrivateMetadataUpdate
} from "@saleor/utils/metadata/updateMetadata";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { getStringOrPlaceholder, maybe } from "../../misc";
import {
  AttributeInputTypeEnum,
  AttributeValueInput,
  PageInput
} from "../../types/globalTypes";
import PageDetailsPage from "../components/PageDetailsPage";
import { PageData, PageSubmitData } from "../components/PageDetailsPage/form";
import { TypedPageRemove, TypedPageUpdate } from "../mutations";
import { TypedPageDetailsQuery } from "../queries";
import { PageRemove } from "../types/PageRemove";
import { pageListUrl, pageUrl, PageUrlQueryParams } from "../urls";
import { getAttributesVariables } from "../utils/handlers";

export interface PageDetailsProps {
  id: string;
  params: PageUrlQueryParams;
}

const createPageInput = (
  data: PageData,
  attributesWithAddedNewFiles: AttributeValueInput[]
): PageInput => ({
  attributes: getAttributesVariables({
    attributes: data.attributes,
    attributesWithAddedNewFiles
  }),
  contentJson: JSON.stringify(data.content),
  isPublished: data.isPublished,
  publicationDate: data.publicationDate,
  seo: {
    description: data.seoDescription,
    title: data.seoTitle
  },
  slug: data.slug === "" ? null : data.slug,
  title: data.title
});

export const PageDetails: React.FC<PageDetailsProps> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const [updateMetadata] = useMetadataUpdate({});
  const [updatePrivateMetadata] = usePrivateMetadataUpdate({});

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const handlePageRemove = (data: PageRemove) => {
    if (data.pageDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(pageListUrl());
    }
  };

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts
  ] = useAttributeValueDeleteMutation({});

  return (
    <TypedPageRemove variables={{ id }} onCompleted={handlePageRemove}>
      {(pageRemove, pageRemoveOpts) => (
        <TypedPageUpdate>
          {(pageUpdate, pageUpdateOpts) => (
            <TypedPageDetailsQuery variables={{ id }}>
              {pageDetails => {
                const handleUpdate = async (data: PageSubmitData) => {
                  let errors: Array<
                    | AttributeErrorFragment
                    | UploadErrorFragment
                    | PageErrorFragment
                  > = [];

                  const uploadFilesResult = await Promise.all(
                    data.attributesWithNewFileValue.map(fileAttribute =>
                      uploadFile({
                        variables: {
                          file: fileAttribute.value
                        }
                      })
                    )
                  );

                  const attributesWithAddedNewFiles: AttributeValueInput[] = uploadFilesResult.reduce(
                    (attributesWithAddedFiles, uploadFileResult, index) => {
                      const attribute = data.attributesWithNewFileValue[index];

                      errors = [
                        ...errors,
                        ...uploadFileResult.data.fileUpload.uploadErrors
                      ];
                      return [
                        ...attributesWithAddedFiles,
                        {
                          file:
                            uploadFileResult.data.fileUpload.uploadedFile.url,
                          id: attribute.id,
                          values: []
                        }
                      ];
                    },
                    []
                  );

                  const result = await pageUpdate({
                    variables: {
                      id,
                      input: createPageInput(data, attributesWithAddedNewFiles)
                    }
                  });

                  errors = [...errors, ...result.data.pageUpdate.errors];

                  if (errors.length === 0) {
                    const deleteAttributeValuesResult = await Promise.all(
                      pageDetails?.data?.page?.attributes.map(
                        existingAttribute => {
                          const fileValueUnused =
                            existingAttribute.attribute.inputType ===
                              AttributeInputTypeEnum.FILE &&
                            existingAttribute.values.length > 0 &&
                            data.attributes.find(
                              dataAttribute =>
                                dataAttribute.id ===
                                existingAttribute.attribute.id
                            ).value.length === 0;

                          if (fileValueUnused) {
                            return deleteAttributeValue({
                              variables: {
                                id: existingAttribute.values[0].id
                              }
                            });
                          }
                        }
                      )
                    );

                    deleteAttributeValuesResult.forEach(deleteValueResult => {
                      errors = [
                        ...errors,
                        ...deleteValueResult.data.attributeValueDelete.errors
                      ];
                    });
                  }

                  return errors;
                };

                const handleSubmit = createMetadataUpdateHandler(
                  pageDetails.data?.page,
                  handleUpdate,
                  variables => updateMetadata({ variables }),
                  variables => updatePrivateMetadata({ variables })
                );

                return (
                  <>
                    <WindowTitle
                      title={maybe(() => pageDetails.data.page.title)}
                    />
                    <PageDetailsPage
                      disabled={
                        pageDetails.loading ||
                        uploadFileOpts.loading ||
                        deleteAttributeValueOpts.loading
                      }
                      errors={pageUpdateOpts.data?.pageUpdate.errors || []}
                      saveButtonBarState={pageUpdateOpts.status}
                      page={pageDetails.data?.page}
                      onBack={() => navigate(pageListUrl())}
                      onRemove={() =>
                        navigate(
                          pageUrl(id, {
                            action: "remove"
                          })
                        )
                      }
                      onSubmit={handleSubmit}
                    />
                    <ActionDialog
                      open={params.action === "remove"}
                      confirmButtonState={pageRemoveOpts.status}
                      title={intl.formatMessage({
                        defaultMessage: "Delete Page",
                        description: "dialog header"
                      })}
                      onClose={() => navigate(pageUrl(id))}
                      onConfirm={pageRemove}
                      variant="delete"
                    >
                      <DialogContentText>
                        <FormattedMessage
                          defaultMessage="Are you sure you want to delete {title}?"
                          description="delete page"
                          values={{
                            title: (
                              <strong>
                                {getStringOrPlaceholder(
                                  pageDetails.data?.page?.title
                                )}
                              </strong>
                            )
                          }}
                        />
                      </DialogContentText>
                    </ActionDialog>
                  </>
                );
              }}
            </TypedPageDetailsQuery>
          )}
        </TypedPageUpdate>
      )}
    </TypedPageRemove>
  );
};
PageDetails.displayName = "PageDetails";
export default PageDetails;
