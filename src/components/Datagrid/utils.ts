import { ColumnPickerProps } from "../ColumnPicker";

export const getDefulaColumnPickerProps = (
  className: string,
): Partial<ColumnPickerProps> => ({
  IconButtonProps: {
    className,
    variant: "ghost",
    hoverOutline: false,
  },
});
