import { InternalRefetchQueriesInclude } from "@apollo/client";
import { MetadataFormData } from "@dashboard/components/Metadata";
import {
  OrderLinesMetadataDocument,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { useMemo, useRef } from "react";
import { useIntl } from "react-intl";

import { OrderMetadataDialogData } from "./OrderMetadataDialog";

export const useHandleOrderLineMetadataSubmit = ({
  initialData,
  onClose,
}: {
  initialData: OrderMetadataDialogData | undefined;
  onClose: () => void;
}) => {
  const notify = useNotifier();
  const intl = useIntl();

  const queriesToRefetch: InternalRefetchQueriesInclude = [OrderLinesMetadataDocument];

  const [updateMetadata] = useUpdateMetadataMutation({
    refetchQueries: queriesToRefetch,
  });
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({
    refetchQueries: queriesToRefetch,
  });

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

  const onSubmit = async (data: MetadataFormData) => {
    submittedData.current = data;

    const errors = await submitHandler(data);

    if (Array.isArray(errors) && errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      onClose();
    }
  };

  return { onSubmit, lastSubmittedData: submittedData.current };
};
