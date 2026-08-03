import { SaleorThrobber } from "@dashboard/components/Throbber";
import { TextField } from "@material-ui/core";
import { useIntl } from "react-intl";

import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";
import { type AssignProductPicker } from "./useAssignProductPicker";

interface AssignProductPickerToolbarProps {
  picker: AssignProductPicker;
}

export const AssignProductPickerToolbar = ({ picker }: AssignProductPickerToolbarProps) => {
  const intl = useIntl();
  const { loading, onQueryChange, query } = picker;

  return (
    <>
      <TextField
        data-test-id="product-search-input"
        name="query"
        value={query}
        onChange={onQueryChange}
        label={intl.formatMessage(messages.assignProductDialogSearch)}
        placeholder={intl.formatMessage(messages.assignProductDialogContent)}
        fullWidth
        InputProps={{
          autoComplete: "off",
          endAdornment: loading && <SaleorThrobber size={16} />,
        }}
      />

      <ModalFilters />
    </>
  );
};
