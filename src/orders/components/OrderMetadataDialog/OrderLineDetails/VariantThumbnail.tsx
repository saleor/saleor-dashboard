import { Box, Skeleton } from "@saleor/macaw-ui-next";

export const VariantThumbnail = ({
  src,
  loading,
}: {
  src: string | undefined;
  loading: boolean;
}) => {
  if (loading) {
    return <Skeleton height={20} width={20} />;
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height={20}
      width={20}
      __padding="2px"
      borderRadius={4}
      borderStyle="solid"
      borderWidth={1}
      borderColor="default1"
      overflow="hidden"
    >
      <Box as="img" width="100%" height="100%" objectFit="contain" src={src} alt="" />
    </Box>
  );
};
