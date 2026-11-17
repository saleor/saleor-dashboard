import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  TaxConfigurationMetadataDocument,
  type TaxConfigurationMetadataQuery,
  type TaxConfigurationMetadataQueryVariables,
} from "@dashboard/graphql";
import { taxesMessages } from "@dashboard/taxes/messages";
import { useIntl } from "react-intl";

interface TaxConfigurationMetadataDialogProps {
  open: boolean;
  onClose: () => void;
  /** The selected channel's tax configuration. */
  taxConfigurationId: string;
  channelName: string;
}

export const TaxConfigurationMetadataDialog = ({
  open,
  onClose,
  taxConfigurationId,
  channelName,
}: TaxConfigurationMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  // Loaded only while the dialog is open, so private metadata stays out of the page's list query.
  // The tax settings form doesn't read metadata, so a save leaves its edits alone.
  return (
    <LazyMetadataDialog<
      TaxConfigurationMetadataQuery,
      TaxConfigurationMetadataQueryVariables,
      NonNullable<TaxConfigurationMetadataQuery["taxConfiguration"]>
    >
      open={open}
      onClose={onClose}
      title={intl.formatMessage(taxesMessages.channelTaxConfigurationMetadataTitle, {
        channelName,
      })}
      query={TaxConfigurationMetadataDocument}
      variables={{ id: taxConfigurationId }}
      select={data => data.taxConfiguration}
    />
  );
};
