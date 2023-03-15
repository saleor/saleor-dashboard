import { Box } from "@saleor/macaw-ui/next";
import clsx from "clsx";
import React from "react";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  style,
  height = "100%",
}) => (
  <Box
    className={clsx("skeleton-animation", className)}
    style={style}
    data-test-id="skeleton"
    borderRadius={3}
    backgroundColor="surfaceNeutralSubdued"
    __height={height}
  >
    &zwnj;
  </Box>
);

Skeleton.displayName = "Skeleton";
export default Skeleton;
