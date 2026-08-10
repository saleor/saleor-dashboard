import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

interface VoucherDiscountSubsectionHeaderProps {
  title: ReactNode;
  hint: ReactNode;
}

/** Stacked title + hint — matches DetailSettingsCard / ChannelSettingRadioGroup microcopy. */
export const VoucherDiscountSubsectionHeader = ({
  title,
  hint,
}: VoucherDiscountSubsectionHeaderProps): JSX.Element => (
  <Box display="flex" flexDirection="column" gap={1}>
    <Text size={3} fontWeight="medium" as="h3" margin={0}>
      {title}
    </Text>
    <Text size={3} color="default2">
      {hint}
    </Text>
  </Box>
);
