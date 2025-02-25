import { Box, Spinner } from "@saleor/macaw-ui-next";
import { ReactNode } from "react";
import InfiniteScrollComponent, { Props } from "react-infinite-scroll-component";

interface InfiniteScrollProps extends Omit<Props, "loader"> {
  id: string;
  loader?: ReactNode;
  children: ReactNode;
}

const InfiniteScrollLoader = () => (
  <Box
    display="flex"
    alignItems="center"
    height={6}
    justifyContent="center"
    marginTop={6}
    marginBottom={3}
  >
    <Spinner />
  </Box>
);

export const InfiniteScroll = ({ children, id, loader, ...props }: InfiniteScrollProps) => {
  const loaderComponent = loader ?? <InfiniteScrollLoader />;

  return (
    <Box id={id} overflowY="auto" __height="inherit" marginBottom={3} className="scrollArea">
      <InfiniteScrollComponent loader={loaderComponent} {...props}>
        {children}
      </InfiniteScrollComponent>
    </Box>
  );
};
