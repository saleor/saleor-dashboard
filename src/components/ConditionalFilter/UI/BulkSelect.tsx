import { DynamicMultiselect } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef, useState } from "react";

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
  label: label.length > 15 ? label.slice(0, 8) + "..." : label,
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

        setOptions(prev => [...prev, toOption(currentValue)]);
        ref.current.value = "";
        ref.current.blur();
        ref.current.focus();

        return;
      case "Backspace":
        if (currentValue === "") {
          setOptions(prev => prev.slice(0, prev.length - 1));
        }

        return;
      default:
        return;
    }
  };

  useEffect(() => {
    onOptionsChange(options);
  }, [options, onOptionsChange]);

  return (
    <DynamicMultiselect
      data-test-id={dataTestId ?? "bulk-select"}
      value={options.map(truncateOptionsLabel)}
      options={[]}
      loading={selected.loading}
      onChange={val => setOptions(val)}
      onInputValueChange={() => undefined}
      onFocus={() => onFocus()}
      onBlur={event => {
        if (!ref.current) return;

        const onBlurValue = event.target.value;

        if (onBlurValue !== "") {
          ref.current.style.display = "none";

          setOptions(prev => [...prev, toOption(onBlurValue)]);
        }

        onBlur();
        ref.current.style.display = "block";
      }}
      onKeyDown={e => onKeyDown(e)}
      error={error}
      helperText={helperText}
      disabled={disabled}
      ref={ref}
      onPaste={e => {
        e.preventDefault();
        e.stopPropagation();

        const clipboardData = e.clipboardData || (window as any).clipboardData;

        const text = clipboardData.getData("text") as string;

        const newOptions = sanitize(text).split(",").filter(clean).map(toOption);

        setOptions(prev => [...prev, ...newOptions]);
      }}
    />
  );
};

export default BulkSelect;
