import { Box } from "@saleor/macaw-ui-next";
import React, { useEffect, useState } from "react";

interface FadeProps {
  children: React.ReactNode;
  show: boolean;
}

const INFO_CONTAINER_HEIGHT = 24;

export const Animated = ({ children, show }: FadeProps) => {
  const [shouldRender, setShouldRender] = useState(show);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const onTransitionEnd = () => {
    if (!show) {
      setShouldRender(false);
    }
  };

  return shouldRender ? (
    <Box
      __transition="opacity 0.3s ease-in-out, margin-top 0.3s ease-in-out"
      __opacity={isVisible ? 1 : 0}
      __marginTop={isVisible ? 0 : -INFO_CONTAINER_HEIGHT}
      onTransitionEnd={onTransitionEnd}
    >
      {children}
    </Box>
  ) : null;
};
