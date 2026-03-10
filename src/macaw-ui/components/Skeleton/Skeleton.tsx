import { HTMLAttributes } from "react";
import { classNames } from "~/utils";

import { Box, PropsWithBox } from "..";

import { skeleton } from "./Skeleton.css";

export type SkeletonProps = PropsWithBox<
  Omit<HTMLAttributes<HTMLDivElement>, "color">
>;

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <Box
      className={classNames(skeleton, className)}
      backgroundColor="default3"
      width="100%"
      height={3}
      borderRadius={2}
      data-macaw-ui-component="Skeleton"
      {...props}
    />
  );
};
