import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { Input } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";
import { type AssignProductPicker } from "./useAssignProductPicker";

interface AssignProductPickerToolbarProps {
  picker: AssignProductPicker;
}

export const AssignProductPickerToolbar = ({ picker }: AssignProductPickerToolbarProps) => {
  const intl = useIntl();
  const { loading, onQueryChange, query, showListLoading } = picker;

  return (
    <>
      <Input
        data-test-id="product-search-input"
        name="query"
        value={query}
        onChange={onQueryChange}
        label={intl.formatMessage(messages.assignProductDialogSearch)}
        placeholder={intl.formatMessage(messages.assignProductDialogContent)}
        autoComplete="off"
        endAdornment={loading && !showListLoading ? <SaleorThrobber size={16} /> : null}
      />

      <ModalFilters />
    </>
  );
};
