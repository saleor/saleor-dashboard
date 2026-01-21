import useDebounce from "@dashboard/hooks/useDebounce";
import { DynamicCombobox } from "@saleor/macaw-ui-next";
import { Control, Controller } from "react-hook-form";
import { useIntl } from "react-intl";

import { MenuItemDialogFormData, MenuItemTypeWithOptions } from "../types";
import { useLinkValue } from "./useLinkValue";

interface MenuItemDialogLinkValueProps {
  linkType: MenuItemTypeWithOptions;
  control: Control<MenuItemDialogFormData, any>;
  disabled: boolean;
  showInitialValue?: boolean;
  initialDisplayValue?: string;
}

export const MenuItemDialogLinkValue = ({
  linkType,
  disabled,
  control,
  showInitialValue,
  initialDisplayValue,
}: MenuItemDialogLinkValueProps) => {
  const intl = useIntl();
  const { fetchMoreProps, loading, options, onQueryChange } = useLinkValue(linkType);

  const debouncedQueryChange = useDebounce(onQueryChange, 500);

  const handleScrollEnd = () => {
    if (fetchMoreProps?.hasMore) {
      fetchMoreProps?.onFetchMore();
    }
  };

  return (
    <Controller
      name="linkValue"
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => {
        const subOptionsListValue = options?.find(o => o.value === value);

        return (
          <DynamicCombobox
            {...field}
            disabled={disabled}
            label={intl.formatMessage({
              id: "WDrC7e",
              defaultMessage: "Link value",
              description: "label",
            })}
            options={options ?? []}
            onChange={option => onChange(option?.value ?? "")}
            value={
              // Show initial value with label in case initial options list from API does not contain it
              showInitialValue
                ? {
                    value,
                    label: initialDisplayValue!,
                  }
                : subOptionsListValue || null
            }
            name="linkValue"
            size="small"
            error={!!error}
            helperText={error?.message}
            onInputValueChange={debouncedQueryChange}
            onFocus={() => onQueryChange("")}
            onScrollEnd={handleScrollEnd}
            loading={loading || fetchMoreProps?.loading}
            data-test-id="menu-item-link-value-input"
          />
        );
      }}
    />
  );
};
