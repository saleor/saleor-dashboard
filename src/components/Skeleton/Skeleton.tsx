import "./skeleton.css";

import { Box, type SkeletonProps } from "@saleor/macaw-ui-next";
import { type ComponentProps } from "react";

export const Skeleton = ({ className, borderRadius = 2, ...props }: SkeletonProps): JSX.Element => (
  <Box
    {...(props as ComponentProps<typeof Box>)}
    borderRadius={borderRadius}
    className={["dashboard-skeleton", className].filter(Boolean).join(" ")}
  />
);

Skeleton.displayName = "Skeleton";
