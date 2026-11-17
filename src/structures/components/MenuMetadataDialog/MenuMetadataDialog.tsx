import { LazyMetadataDialog } from "@dashboard/components/MetadataDialog/LazyMetadataDialog";
import {
  MenuMetadataDocument,
  type MenuMetadataQuery,
  type MenuMetadataQueryVariables,
} from "@dashboard/graphql";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface MenuMetadataDialogProps {
  menuId: string;
  open: boolean;
  onClose: () => void;
}

export const MenuMetadataDialog = ({
  menuId,
  open,
  onClose,
}: MenuMetadataDialogProps): React.ReactNode => {
  const intl = useIntl();

  // Loaded only while the dialog is open. The page's cache-and-network MenuDetails query doesn't
  // read metadata, so a save doesn't make it reload the item tree.
  return (
    <LazyMetadataDialog<
      MenuMetadataQuery,
      MenuMetadataQueryVariables,
      NonNullable<MenuMetadataQuery["menu"]>
    >
      open={open}
      onClose={onClose}
      title={intl.formatMessage(messages.title)}
      query={MenuMetadataDocument}
      variables={{ id: menuId }}
      select={data => data.menu}
    />
  );
};
