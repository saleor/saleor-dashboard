import DialogContentText from "@material-ui/core/DialogContentText";
import { useAttributeValueDeleteMutation } from "@saleor/attributes/mutations";
import {
  getAttributesFromFileUploadResult,
  mergeFileUploadErrors
} from "@saleor/attributes/utils/data";
import {
  handleUploadMultipleFiles,
  prepareAttributesInput
} from "@saleor/attributes/utils/handlers";
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
import { AttributeValueInput, PageInput } from "../../types/globalTypes";
import PageDetailsPage from "../components/PageDetailsPage";
import { PageData, PageSubmitData } from "../components/PageDetailsPage/form";
import { usePageRemoveMutation, usePageUpdateMutation } from "../mutations";
import { usePageDetailsQuery } from "../queries";
import { PageRemove } from "../types/PageRemove";
import { pageListUrl, pageUrl, PageUrlQueryParams } from "../urls";
import { isFileValueUnused } from "../utils/data";

export interface PageDetailsProps {
  id: string;
  params: PageUrlQueryParams;
}

const createPageInput = (
  data: PageData,
  attributesWithAddedNewFiles: AttributeValueInput[]
): PageInput => ({
  attributes: prepareAttributesInput({
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

  const pageDetails = usePageDetailsQuery({
    variables: {
      id
    }
  });

  const [uploadFile, uploadFileOpts] = useFileUploadMutation({});

  const [pageUpdate, pageUpdateOpts] = usePageUpdateMutation({});

  const [
    deleteAttributeValue,
    deleteAttributeValueOpts
  ] = useAttributeValueDeleteMutation({});

  const [pageRemove, pageRemoveOpts] = usePageRemoveMutation({
    onCompleted: (data: PageRemove) => {
      if (data.pageDelete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges)
        });
        navigate(pageListUrl());
      }
    }
  });

  const handleUpdate = async (data: PageSubmitData) => {
    let errors: Array<
      AttributeErrorFragment | UploadErrorFragment | PageErrorFragment
    > = [];

    const uploadFilesResult = await handleUploadMultipleFiles(
      data.attributesWithNewFileValue,
      variables => uploadFile({ variables })
    );

    errors = [...errors, ...mergeFileUploadErrors(uploadFilesResult)];
    const attributesWithAddedNewFiles = getAttributesFromFileUploadResult(
      data.attributesWithNewFileValue,
      uploadFilesResult
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
        pageDetails?.data?.page?.attributes.map(existingAttribute => {
          const fileValueUnused = isFileValueUnused(data, existingAttribute);

          if (fileValueUnused) {
            return deleteAttributeValue({
              variables: {
                id: existingAttribute.values[0].id
              }
            });
          }
        })
      );

      errors = deleteAttributeValuesResult.reduce(
        (errors, deleteValueResult) => {
          if (deleteValueResult?.data?.attributeValueDelete?.errors) {
            return [
              ...errors,
              ...deleteValueResult.data.attributeValueDelete.errors
            ];
          }
          return errors;
        },
        errors
      );
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
      <WindowTitle title={maybe(() => pageDetails.data.page.title)} />
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
        onConfirm={() => pageRemove({ variables: { id } })}
        variant="delete"
      >
        <DialogContentText>
          <FormattedMessage
            defaultMessage="Are you sure you want to delete {title}?"
            description="delete page"
            values={{
              title: (
                <strong>
                  {getStringOrPlaceholder(pageDetails.data?.page?.title)}
                </strong>
              )
            }}
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};
PageDetails.displayName = "PageDetails";
export default PageDetails;
