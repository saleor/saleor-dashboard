import "./RippleAnimation.css";

import { Box, BoxProps } from "@saleor/macaw-ui-next";
import type { CSSProperties } from "react";

interface RippleAnimationProps extends BoxProps {}

export function RippleAnimation({ ...props }: RippleAnimationProps) {
  const containerStyle: CSSProperties = {
    position: "relative",
    width: "7.5px",
    height: "7.5px",
  };

  const rippleBaseStyle: CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    animation: "ripple 4s infinite ease-out",
  };

  return (
    <Box style={containerStyle} {...props}>
      {/* First ripple */}
      <div
        style={{
          ...rippleBaseStyle,
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          animationDelay: "0s",
        }}
      />
      {/* Second ripple */}
      <div
        style={{
          ...rippleBaseStyle,
          backgroundColor: "rgba(37, 99, 235, 0.5)",
          animationDelay: "1s",
        }}
      />
      {/* Third ripple */}
      <div
        style={{
          ...rippleBaseStyle,
          backgroundColor: "rgba(29, 78, 216, 0.4)",
          animationDelay: "2s",
        }}
      />
      {/* Fourth ripple */}
      <div
        style={{
          ...rippleBaseStyle,
          backgroundColor: "rgba(30, 64, 175, 0.3)",
          animationDelay: "3s",
        }}
      />
    </Box>
  );
}
