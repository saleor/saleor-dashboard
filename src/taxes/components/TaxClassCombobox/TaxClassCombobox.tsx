import { type TaxClassBaseFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { taxesMessages } from "@dashboard/taxes/messages";
import { type FetchMoreProps } from "@dashboard/types";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { type MessageDescriptor, useIntl } from "react-intl";

/** Sentinel value for the explicit empty option in the tax class list. */
export const TAX_CLASS_NONE_VALUE = "";

interface TaxClassComboboxProps {
  value: string;
  displayName: string;
  taxClasses: TaxClassBaseFragment[];
  disabled?: boolean;
  name?: string;
  /**
   * Label for the empty list option that unsets the tax class.
   * Defaults to "None". Products should pass the product-type default copy.
   */
  emptyOptionMessage?: MessageDescriptor;
  onChange: (event: ChangeEvent) => void;
  onFetchMore: FetchMoreProps;
}

export const TaxClassCombobox = ({
  value,
  displayName,
  taxClasses,
  disabled = false,
  name = "taxClassId",
  emptyOptionMessage = taxesMessages.taxClassNone,
  onChange,
  onFetchMore,
}: TaxClassComboboxProps) => {
  const intl = useIntl();

  const emptyOption: Option = useMemo(
    () => ({
      value: TAX_CLASS_NONE_VALUE,
      label: intl.formatMessage(emptyOptionMessage),
    }),
    [emptyOptionMessage, intl],
  );

  const options: Option[] = useMemo(
    () => [
      emptyOption,
      ...taxClasses.map(taxClass => ({
        label: taxClass.name,
        value: taxClass.id,
      })),
    ],
    [emptyOption, taxClasses],
  );

  const selected: Option = value
    ? {
        value,
        label: displayName || value,
      }
    : emptyOption;

  const handleChange = (option: Option | null) => {
    onChange({
      target: {
        name,
        value: option?.value ?? TAX_CLASS_NONE_VALUE,
      },
    });
  };

  return (
    <DynamicCombobox
      autoComplete="off"
      disabled={disabled}
      name={name}
      label={intl.formatMessage(taxesMessages.taxClass)}
      options={options}
      value={selected}
      onChange={handleChange}
      onScrollEnd={() => {
        if (onFetchMore.hasMore) {
          onFetchMore.onFetchMore();
        }
      }}
      loading={onFetchMore.loading}
    />
  );
};
