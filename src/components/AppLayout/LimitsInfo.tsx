import { Box } from "@saleor/macaw-ui-next";

interface LimitsInfoProps {
  text: string;
}

/**
 * @deprecated use `Text` instead
 */
export const LimitsInfo = ({ text }: LimitsInfoProps) => (
  <Box position="absolute" left={7} bottom={1}>
    {text}
  </Box>
);
