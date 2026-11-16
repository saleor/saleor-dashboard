import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  ShopMetadataDocument,
  type ShopMetadataQuery,
  type ShopMetadataQueryVariables,
} from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ShopMetadataDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ShopMetadataDialog = ({ open, onClose }: ShopMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  // Loaded only while the dialog is open, so private metadata (MANAGE_SETTINGS) stays out of the
  // page query. The Store settings form doesn't read metadata, so a save leaves its edits alone.
  return (
    <LazyMetadataDialog<ShopMetadataQuery, ShopMetadataQueryVariables, ShopMetadataQuery["shop"]>
      open={open}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      query={ShopMetadataDocument}
      select={data => data.shop}
    />
  );
};
