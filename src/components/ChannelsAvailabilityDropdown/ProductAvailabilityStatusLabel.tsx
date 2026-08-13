import { type DotStatus, StatusDot } from "@dashboard/components/StatusDot/StatusDot";
import { Box, Text, type TextProps } from "@saleor/macaw-ui-next";

interface ProductAvailabilityStatusLabelProps {
  label: string;
  status: DotStatus;
  ellipsis?: boolean;
  color?: TextProps["color"];
}

export const ProductAvailabilityStatusLabel = ({
  label,
  status,
  ellipsis = true,
  color = "default1",
}: ProductAvailabilityStatusLabelProps) => (
  <Box display="flex" alignItems="baseline" gap={2} minWidth={0}>
    <Box flexShrink="0" display="flex" alignItems="center" __height="1em">
      <StatusDot status={status} />
    </Box>
    <Text size={2} ellipsis={ellipsis} display="block" minWidth={0} __flex="1" color={color}>
      {label}
    </Text>
  </Box>
);

ProductAvailabilityStatusLabel.displayName = "ProductAvailabilityStatusLabel";
