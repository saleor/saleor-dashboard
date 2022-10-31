import { useTheme } from "@saleor/macaw-ui";
import React, { CSSProperties, FC, PropsWithChildren, useEffect } from "react";
import ReactDOM from "react-dom";

import { useDelayedState } from "./useDelayedState";

const modalRoot =
  document.getElementById("modal-root") || document.createElement("div");

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

const useEscapeKey = (callback?: () => void) => {
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [callback]);
};

type FullScreenContainerProps = FC<
  PropsWithChildren<{
    open?: boolean;
    className?: string;
    onEscapePress?: () => void;
  }>
>;

const Portal: FullScreenContainerProps = ({
  className,
  children,
  open,
  onEscapePress,
}) => {
  const { delayedState: delayedOpen, duration } = useDelayedState(open);
  const styles = useAnimationStyles(open, duration);
  useEscapeKey(onEscapePress);

  return ReactDOM.createPortal(
    <div className={className} style={styles}>
      {delayedOpen && children}
    </div>,
    modalRoot,
  );
};

export const FullScreenContainer: FullScreenContainerProps = ({
  children,
  ...rest
}) => (
  <>
    <Portal {...rest}>{children}</Portal>
    {children}
  </>
);
