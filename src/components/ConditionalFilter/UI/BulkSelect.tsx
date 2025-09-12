import { DynamicMultiselect } from "@saleor/macaw-ui-next";
import { useRef, useState } from "react";
import * as React from "react";

import { BulkselectOperator, RightOperatorOption } from "./types";

export interface BulkSelectProps {
  selected: BulkselectOperator;
  error: boolean;
  helperText: string;
  disabled: boolean;
  dataTestId?: string;
  onFocus: () => void;
  onBlur: () => void;
  onOptionsChange: (options: RightOperatorOption[]) => void;
}

const truncateOptionsLabel = ({ label, ...rest }: RightOperatorOption) => ({
  label: label.length > 8 ? label.slice(0, 8) + "..." : label,
  ...rest,
});

const sanitize = (text: string) => text.replace(/\s/g, ",");
const clean = (text: string) => text !== "";
const toOption = (text: string) => ({
  label: text,
  value: text,
  slug: text,
});

const BulkSelect = ({
  selected,
  dataTestId,
  error,
  helperText,
  disabled,
  onFocus,
  onBlur,
  onOptionsChange,
}: BulkSelectProps) => {
  const [options, setOptions] = useState<RightOperatorOption[]>(selected.value ?? []);

  const ref = useRef<HTMLInputElement>(null);

  const handleOptionsChange = (options: RightOperatorOption[]) => {
    setOptions(options);
    onOptionsChange(options);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!ref.current) return;

    const currentValue = (event.target as HTMLInputElement).value;

    switch (event.key) {
      case "Tab":
      case "Enter":
      case ",":
      case " ":
        event.preventDefault();
        event.stopPropagation();

        if (currentValue === "") {
          return;
        }

        handleOptionsChange([...options, toOption(currentValue)]);
        ref.current.value = "";
        ref.current.blur();
        ref.current.focus();

        return;
      case "Backspace":
        if (currentValue === "") {
          handleOptionsChange(options.slice(0, options.length - 1));
        }

        return;
      default:
        return;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (!ref.current) return;

    const onBlurValue = e.target.value;

    if (onBlurValue !== "") {
      ref.current.style.display = "none";

      handleOptionsChange([...options, toOption(onBlurValue)]);
    }

    onBlur();
    ref.current.style.display = "block";
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const clipboardData = e.clipboardData || (window as any).clipboardData;

    const text = clipboardData.getData("text") as string;

    const newOptions = sanitize(text).split(",").filter(clean).map(toOption);

    handleOptionsChange([...options, ...newOptions]);
  };

  return (
    <DynamicMultiselect
      data-test-id={dataTestId ?? "bulk-select"}
      value={options.map(truncateOptionsLabel)}
      options={[]}
      loading={selected.loading}
      onChange={handleOptionsChange}
      onInputValueChange={() => undefined}
      onFocus={() => onFocus()}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      error={error}
      helperText={helperText}
      disabled={disabled}
      ref={ref}
      onPaste={handlePaste}
    />
  );
};

export default BulkSelect;
