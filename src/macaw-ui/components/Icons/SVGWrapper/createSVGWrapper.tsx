import { ReactNode, forwardRef } from "react";
import { SVGWrapper, SVGWrapperProps } from "./SVGWrapper";

export const createSVGWrapper = (node: ReactNode, viewBox?: string) => {
  const Wrapper = forwardRef<SVGSVGElement, Omit<SVGWrapperProps, "children">>(
    (props, ref) => (
      <SVGWrapper
        viewBox={viewBox}
        ref={ref}
        data-macaw-ui-component="Icon"
        {...props}
      >
        {node}
      </SVGWrapper>
    )
  );

  Wrapper.displayName = "withSVGWrapper";

  return Wrapper;
};
