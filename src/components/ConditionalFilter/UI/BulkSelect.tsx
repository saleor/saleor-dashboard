import { DynamicMultiselect } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef, useState } from "react";

import { FilterEventEmitter } from "./EventEmitter";
import { BulkselectOperator, RightOperatorOption } from "./types";

interface BulkSelectProps {
  selected: BulkselectOperator;
  emitter: FilterEventEmitter;
  index: number;
  error: boolean;
  helperText: string;
  disabled: boolean;
}

const truncate = ({ label, ...rest }: RightOperatorOption) => ({
  label: label.length > 15 ? label.slice(0, 15) + "..." : label,
  ...rest,
});

const BulkSelect = ({ selected, emitter, index, error, helperText, disabled }: BulkSelectProps) => {
  const [options, setOptions] = useState<RightOperatorOption[]>(selected.value ?? []);

  const ref = useRef<HTMLInputElement>(null);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const currentValue = (event.target as HTMLInputElement).value;

    switch (event.key) {
      case "Tab":
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
    />
  );
};

export default BulkSelect;
