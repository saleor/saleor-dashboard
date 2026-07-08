import { Box } from "@saleor/macaw-ui-next";
import type * as React from "react";
import InfiniteScrollComponent, { type Props } from "react-infinite-scroll-component";

import { SaleorThrobber } from "../Throbber";
import styles from "./InfiniteScroll.module.css";

type InfiniteScrollBaseProps = Omit<Props, "loader" | "id" | "scrollableTarget"> & {
  loader?: React.ReactNode;
  children: React.ReactNode;
  flush?: boolean;
};

type InfiniteScrollProps =
  | (InfiniteScrollBaseProps & { id: string; scrollableTarget?: Props["scrollableTarget"] })
  | (InfiniteScrollBaseProps & {
      scrollableTarget: NonNullable<Props["scrollableTarget"]>;
      id?: never;
    });

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
    throw new Error("InfiniteScroll requires either `id` or `scrollableTarget`.");
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
