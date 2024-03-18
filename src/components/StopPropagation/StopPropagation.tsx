import React, { ReactNode } from "react";

interface StopPropagationProps {
  children: ReactNode;
}

// If you don't want to click events bubble in the DOM tree, you can use this component.
export const StopPropagation = ({ children }: StopPropagationProps) => {
  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return <div onClick={stopPropagation}>{children}</div>;
};
