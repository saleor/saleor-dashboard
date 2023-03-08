import { ColumnPickerProps } from "../ColumnPicker";

export const getDefultColumnPickerProps = (
  className: string,
): Partial<ColumnPickerProps> => ({
  IconButtonProps: {
    className,
    variant: "ghost",
    hoverOutline: false,
  },
});
