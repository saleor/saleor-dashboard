import { useInfinityScroll } from "@dashboard/hooks/useInfinityScroll";
import { List } from "@saleor/macaw-ui/next";
import React from "react";

interface ProductStocksInfinityScrollListProps {
  children: React.ReactNode;
  onLoadMore: () => void;
}
export const ProductStocksInfinityScrollList = ({
  children,
  onLoadMore,
}: ProductStocksInfinityScrollListProps) => {
  const { scrollRef } = useInfinityScroll<HTMLOListElement>({
    onLoadMore,
    threshold: 1000,
  });

  return (
    <List
      ref={scrollRef}
      id="warehouse-list"
      padding={2}
      borderRadius={4}
      boxShadow="overlay"
      backgroundColor="surfaceNeutralPlain"
      __maxHeight={400}
      overflowY="auto"
    >
      {children}
    </List>
  );
};

ProductStocksInfinityScrollList.displayName = "ProductStocksInfinityScrollList";
