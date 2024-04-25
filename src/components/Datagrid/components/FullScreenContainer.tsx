// @ts-strict-ignore
import { useTheme } from "@saleor/macaw-ui";
import React, { CSSProperties, FC, PropsWithChildren } from "react";
import ReactDOM from "react-dom";

import { useDelayedState } from "../hooks/useDelayedState";

const modalRoot = document.getElementById("modal-root") || document.createElement("div");
const useEase = (duration: number) => {
  const { transitions } = useTheme();
  const { easeIn, easeOut } = transitions.easing;
  const options = { duration, delay: 0 };
  const transitionIn = transitions.create("all", {
    ...options,
    easing: easeIn,
  });
  const transitionOut = transitions.create("all", {
    ...options,
    easing: easeOut,
  });

  return { transitionIn, transitionOut };
};
const useAnimationStyles = (isOpen: boolean, duration: number) => {
  const { transitionIn, transitionOut } = useEase(duration);
  const initialStyles: CSSProperties = {
    opacity: 0,
    position: "fixed",
    inset: 0,
    zIndex: -1,
  };
  const openStyles = {
    transition: transitionIn,
    opacity: 1,
    zIndex: 1,
  };
  const closedStyles = {
    transition: transitionOut,
    opacity: 0,
  };

  return {
    ...initialStyles,
    ...(isOpen ? openStyles : closedStyles),
  };
};

type FullScreenContainerProps = FC<
  PropsWithChildren<{
    open?: boolean;
    className?: string;
  }>
>;

const Portal: FullScreenContainerProps = ({ className, children, open }) => {
  const { delayedState: delayedOpen, duration } = useDelayedState(open);
  const styles = useAnimationStyles(open, duration);

  return ReactDOM.createPortal(
    <div className={className} style={styles}>
      {delayedOpen && children}
    </div>,
    modalRoot,
  );
};

export const FullScreenContainer: FullScreenContainerProps = ({ children, ...rest }) => (
  <>
    <Portal {...rest}>{children}</Portal>
    {children}
  </>
);
