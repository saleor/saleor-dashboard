import { RadioGroup } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

interface RadioProps {
  checked: boolean;
  value: string;
  disabled?: boolean;
  /** Rendered as the radio label, clickable like the radio itself. */
  children?: ReactNode;
  onChange?: (value: string) => void;
  "data-test-id"?: string;
}

/**
 * Single radio for row pickers, where the row — not the radio — owns the selection,
 * so every row renders its own one-item group. Rows that handle the click themselves
 * leave `onChange` out and let it bubble, keeping one handler per selection.
 */
export const Radio = ({
  checked,
  value,
  disabled,
  children = null,
  onChange,
  "data-test-id": dataTestId,
}: RadioProps) => (
  <RadioGroup value={checked ? value : ""} onValueChange={onChange}>
    <RadioGroup.Item
      id={value}
      value={value}
      disabled={disabled}
      data-test-id={dataTestId ?? "radio"}
    >
      {children}
    </RadioGroup.Item>
  </RadioGroup>
);
