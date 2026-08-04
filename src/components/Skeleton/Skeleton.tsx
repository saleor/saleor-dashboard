import "./skeleton.css";

import { Box, type SkeletonProps } from "@saleor/macaw-ui-next";

export const Skeleton = ({ className, borderRadius = 2, ...props }: SkeletonProps): JSX.Element => (
  <Box
    {...props}
    borderRadius={borderRadius}
    className={["dashboard-skeleton", className].filter(Boolean).join(" ")}
  />
);

Skeleton.displayName = "Skeleton";
