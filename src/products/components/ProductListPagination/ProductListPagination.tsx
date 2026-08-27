import { DatagridPagination, type ListSettingsUpdate } from "@dashboard/components/TablePagination";
import { type ProductListColumns } from "@dashboard/config";
import { type ListProps } from "@dashboard/types";
import { useIntl } from "react-intl";

import { messages } from "../ProductListDatagrid/messages";

interface ProductListPaginationProps {
  settings?: ListProps<ProductListColumns>["settings"];
  disabled: boolean;
  onUpdateListSettings?: ListSettingsUpdate;
}

export const ProductListPagination = ({
  settings,
  disabled,
  onUpdateListSettings,
}: ProductListPaginationProps): JSX.Element => {
  const intl = useIntl();

  return (
    <DatagridPagination
      component="div"
      settings={settings}
      disabled={disabled}
      labels={{
        noOfRows: intl.formatMessage(messages.pagination),
      }}
      onUpdateListSettings={onUpdateListSettings}
    />
  );
};
