import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";
import InfiniteScrollComponent, { type Props } from "react-infinite-scroll-component";

import { SaleorThrobber } from "../Throbber";
import styles from "./InfiniteScroll.module.css";

interface InfiniteScrollProps extends Omit<Props, "loader"> {
  /** Required when this component owns the scroll container. Omit when scrolling a parent element. */
  id?: string;
  loader?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
}

const InfiniteScrollLoader = () => (
  <Box
    display="flex"
    alignItems="center"
    height={6}
    justifyContent="center"
    marginTop={4}
    marginBottom={4}
  >
    <SaleorThrobber size={20} />
  </Box>
);

export const InfiniteScroll = ({
  children,
  flush = false,
  id,
  loader,
  scrollableTarget,
  ...props
}: InfiniteScrollProps) => {
  const loaderComponent = loader ?? <InfiniteScrollLoader />;
  const usesParentScroller = scrollableTarget != null && scrollableTarget !== id;

  if (usesParentScroller) {
    return (
      <Box
        className={styles.fillContent}
        marginBottom={flush ? 0 : 3}
        data-test-id="infinite-scroll-content"
      >
        <InfiniteScrollComponent
          loader={loaderComponent}
          scrollableTarget={scrollableTarget}
          {...props}
        >
          {children}
        </InfiniteScrollComponent>
      </Box>
    );
  }

  const scrollContainerId =
    id ?? (typeof scrollableTarget === "string" ? scrollableTarget : undefined);

  if (!scrollContainerId) {
    throw new Error("InfiniteScroll requires `id` when no parent `scrollableTarget` is provided.");
  }

  return (
    <Box
      id={scrollContainerId}
      overflowY="auto"
      __height="inherit"
      marginBottom={flush ? 0 : 3}
      className="scrollArea"
    >
      <InfiniteScrollComponent
        loader={loaderComponent}
        scrollableTarget={scrollContainerId}
        {...props}
      >
        {children}
      </InfiniteScrollComponent>
    </Box>
  );
};
