import Skeleton from "@saleor/components/Skeleton";
import React from "react";

interface ContentOrSkeletonProps {
  condition: any;
  children: React.ReactNode | React.ReactNode[];
}

const ContentOrSkeleton: React.FC<ContentOrSkeletonProps> = ({
  condition,
  children
}) => (!!condition ? children : <Skeleton />);

export default ContentOrSkeleton;
