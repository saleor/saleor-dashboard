import { Children, ReactNode, isValidElement, ReactElement } from "react";
import { NoOptions } from "./NoOptions";

export const hasNoOptions = (children: ReactNode): boolean => {
  let hasNoOptions = false;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child as ReactElement).type === NoOptions) {
      hasNoOptions = true;
    }
  });

  return hasNoOptions;
};
