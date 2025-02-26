import { MetadataFormData } from "@dashboard/components/Metadata";
import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useMemo, useRef } from "react";

import { OrderMetadataDialogData } from "./OrderMetadataDialog";

export const useHandleOrderLineMetadataSubmit = ({
  initialData,
}: {
  initialData: OrderMetadataDialogData | undefined;
}) => {
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const submittedData = useRef<MetadataFormData>();

  const submitHandler = useMemo(() => {
    if (!initialData) {
      return () => Promise.resolve();
    }

    return createMetadataUpdateHandler(
      initialData,
      () => Promise.resolve([]),
      variables => updateMetadata({ variables }),
      variables => updatePrivateMetadata({ variables }),
    );
  }, [initialData, updateMetadata, updatePrivateMetadata]);

  const onSubmit = (data: MetadataFormData) => {
    submittedData.current = data;

    return submitHandler(data);
  };

  return { onSubmit, lastSubmittedData: submittedData.current };
};
