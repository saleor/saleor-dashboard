import { Box, PropsWithBox, Text } from "@saleor/macaw-ui-next";

type Props = PropsWithBox<{
  initials: string;
}>;

export const UserAvatar = ({ initials, ...props }: Props) => (
  <Box
    width={8}
    height={8}
    borderRadius="100%"
    borderStyle="solid"
    borderColor="default1"
    display="flex"
    alignItems="center"
    justifyContent="center"
    {...props}
  >
    <Text size={2} fontWeight="medium" color="default1">
      {initials}
    </Text>
  </Box>
);
