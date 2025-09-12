import { Box, Text } from "@saleor/macaw-ui-next";

export const UserAvatar = ({ initials }: { initials: string }) => (
  <Box
    width={8}
    height={8}
    borderRadius="100%"
    borderStyle="solid"
    borderColor="default1"
    display="flex"
    alignItems="center"
    justifyContent="center"
  >
    <Text size={2} fontWeight="medium" color="default1">
      {initials}
    </Text>
  </Box>
);
