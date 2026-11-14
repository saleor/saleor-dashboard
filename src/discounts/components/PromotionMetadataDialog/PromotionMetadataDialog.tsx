import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  PromotionMetadataDocument,
  type PromotionMetadataQuery,
  type PromotionMetadataQueryVariables,
} from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface PromotionMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  promotionId: string;
}

export const PromotionMetadataDialog = ({
  open,
  onClose,
  promotionId,
}: PromotionMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  // Loaded only while the dialog is open. The promotion form doesn't read metadata, so a save
  // leaves its edits alone.
  return (
    <LazyMetadataDialog<
      PromotionMetadataQuery,
      PromotionMetadataQueryVariables,
      NonNullable<PromotionMetadataQuery["promotion"]>
    >
      open={open}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      query={PromotionMetadataDocument}
      variables={{ id: promotionId }}
      select={data => data.promotion}
    />
  );
};
