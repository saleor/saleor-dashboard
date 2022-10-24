import { useTheme } from "@saleor/macaw-ui";
import React, {
  CSSProperties,
  FC,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

const modalRoot = document.getElementById("modal-root");

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

interface FullScreenContainerProps {
  open?: boolean;
  className?: string;
}

const Portal = ({ className, children, open }) => {
  const {
    transitions: { duration },
  } = useTheme();
  const [delayedOpen, setDelayeedOpen] = useState(open);
  const styles = useAnimationStyles(open, duration.standard);

  useEffect(() => {
    const delay = open ? 0 : duration.standard;
    const timeout = setTimeout(() => {
      setDelayeedOpen(open);
    }, delay);
    return () => {
      clearTimeout(timeout);
    };
  }, [open]);

  return ReactDOM.createPortal(
    <div className={className} style={styles}>
      {delayedOpen && children}
    </div>,
    modalRoot,
  );
};

export const FullScreenContainer: FC<PropsWithChildren<
  FullScreenContainerProps
>> = ({ children, open, className }) => (
  <>
    <Portal className={className} open={open}>
      {children}
    </Portal>
    {children}
  </>
);
