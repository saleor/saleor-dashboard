import React, { ReactNode } from "react";

interface StopPropagationProps {
  children: ReactNode;
  preventDefault?: boolean;
}

// If you don't want to click events bubble in the DOM tree, you can use this component.
export const StopPropagation = ({ children, preventDefault = false }: StopPropagationProps) => {
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (preventDefault) {
      e.preventDefault();
    }
  };

  return <div onClick={stopPropagation}>{children}</div>;
};
