import { AttributeValueEditDialogFormData } from "@dashboard/attributes/utils/data";
import { useFileUploadMutation } from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { errorMessages } from "@dashboard/intl";
import { useState } from "react";
import { useIntl } from "react-intl";

export const useFileProcessing = ({
  set,
}: {
  set: (data: Partial<AttributeValueEditDialogFormData>) => void;
}) => {
  const notify = useNotifier();
  const intl = useIntl();
  const [processing, setProcessing] = useState(false);

  const [uploadFile] = useFileUploadMutation({});

  const handleFileUpload = async (file: File) => {
    setProcessing(true);

    const { data } = await uploadFile({ variables: { file } });

    if (data?.fileUpload?.errors?.length) {
      notify({
        status: "error",
        title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
        text: intl.formatMessage(errorMessages.imageUploadErrorText),
      });
    } else {
      set({
        fileUrl: data?.fileUpload?.uploadedFile?.url,
        contentType: data?.fileUpload?.uploadedFile?.contentType ?? "",
        value: undefined,
      });
    }
  };

  const handleFileDelete = () => {
    set({
      fileUrl: undefined,
      contentType: undefined,
      value: undefined,
    });
  };

  const handleOnload = () => {
    setProcessing(false);
  };

  return {
    processing,
    handleFileUpload,
    handleFileDelete,
    handleOnload,
  };
};
