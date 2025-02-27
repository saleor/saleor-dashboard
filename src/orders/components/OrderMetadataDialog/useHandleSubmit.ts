import { MetadataFormData } from "@dashboard/components/Metadata";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useRef } from "react";

import { OrderMetadataDialogData } from "./OrderMetadataDialog";

export const useHandleOrderLineMetadataSubmit = ({
  initialData,
}: {
  initialData: OrderMetadataDialogData;
}) => {
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const submittedData = useRef<MetadataFormData>();

  const submitHandler = createMetadataUpdateHandler(
    initialData,
    () => Promise.resolve([]),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  const onSubmit = (data: MetadataFormData) => {
    submittedData.current = data;

    return submitHandler(data);
  };

  return { onSubmit, lastSubmittedData: submittedData.current };
};
