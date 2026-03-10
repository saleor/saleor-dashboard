import { ButtonProps } from "./Button";

export const isFixedWidth = ({ fixedWidth, icon, children }: ButtonProps) => {
  if (fixedWidth === undefined) {
    return !!icon && !children;
  } else return fixedWidth;
};
