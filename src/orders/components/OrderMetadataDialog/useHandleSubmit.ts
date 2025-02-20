import { useUpdateMetadataMutation, useUpdatePrivateMetadataMutation } from "@dashboard/graphql";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";

import { OrderMetadataDialogData } from "./OrderMetadataDialog";

export const useHandleOrderLineMetadataSubmit = ({
  initialData,
}: {
  initialData: OrderMetadataDialogData;
}) => {
  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  const onSubmit = createMetadataUpdateHandler(
    initialData,
    () => Promise.resolve([]),
    variables => updateMetadata({ variables }),
    variables => updatePrivateMetadata({ variables }),
  );

  return onSubmit;
};
