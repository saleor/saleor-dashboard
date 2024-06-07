import { DynamicMultiselect } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef, useState } from "react";

import { FilterEventEmitter } from "./EventEmitter";
import { BulkselectOperator, RightOperatorOption } from "./types";

export interface BulkSelectProps {
  selected: BulkselectOperator;
  emitter: FilterEventEmitter;
  index: number;
  error: boolean;
  helperText: string;
  disabled: boolean;
}

const truncate = ({ label, ...rest }: RightOperatorOption) => ({
  label: label.length > 15 ? label.slice(0, 8) + "..." : label,
  ...rest,
});

const sanitize = (text: string) => text.replace(/\s/g, ",");
const clean = (text: string) => text !== "";
const toOptions = (text: string) => ({
  label: text,
  value: text,
  slug: text,
});

const BulkSelect = ({ selected, emitter, index, error, helperText, disabled }: BulkSelectProps) => {
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

        setOptions(prev => [
          ...prev,
          {
            label: currentValue,
            value: currentValue,
            slug: currentValue,
          },
        ]);
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
    emitter.changeRightOperator(index, options);
  }, [options, emitter, index]);

  return (
    <DynamicMultiselect
      data-test-id={`right-${index}`}
      value={options.map(truncate)}
      options={[]}
      loading={selected.loading}
      onChange={val => {
        setOptions(val);
      }}
      onInputValueChange={() => undefined}
      onFocus={() => {
        emitter.focusRightOperator(index);
      }}
      onBlur={event => {
        if (!ref.current) return;

        const onBlurValue = event.target.value;

        if (onBlurValue !== "") {
          ref.current.style.display = "none";

          setOptions(prev => [
            ...prev,
            {
              label: onBlurValue,
              value: onBlurValue,
              slug: onBlurValue,
            },
          ]);
        }

        emitter.blurRightOperator(index);
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

        const newOptions = sanitize(text).split(",").filter(clean).map(toOptions);

        setOptions(prev => [...prev, ...newOptions]);
      }}
    />
  );
};

export default BulkSelect;
