import { getUserInitials } from "@dashboard/misc";
import { Box, Button, Text } from "@saleor/macaw-ui-next";
import { PencilIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { OrderRefundDisplay } from "./order-refunds-view-model";
import { StatusBadge } from "./status-badge";
import { UserAvatar } from "./user-avatar";

interface RefundListItemProps {
  refund: OrderRefundDisplay;
  onEditRefund?: (refundId: string) => void;
}

export const RefundListItem = ({ refund, onEditRefund }: RefundListItemProps) => {
  const intl = useIntl();

  return (
    <Box
      key={refund.id}
      display="grid"
      __gridTemplateColumns="auto 1fr auto"
      alignItems="center"
      gap={7}
      as="li"
    >
      <Box display="flex" alignItems="center" gap={3}>
        <UserAvatar initials={getUserInitials(refund.user)} />
        <StatusBadge status={refund.status} />
      </Box>
      <Box display="grid" __gridTemplateColumns="auto 1fr" gap={3}>
        <Text size={3} color="default2">
          {intl.formatDate(refund.createdAt, {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })}
        </Text>
        <Text
          size={3}
          color="default2"
          __maxWidth="max-content"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {refund.type === "manual" ? "Manual refund" : refund.reason}
        </Text>
      </Box>

      <Box display="flex" alignItems="center" gap={3}>
        <Box display="grid" __gridTemplateColumns="1fr auto" gap={2}>
          <Text size={3} color="default2" fontWeight="medium" fontFamily="Geist Mono">
            {refund.amount.currency}
          </Text>
          <Text size={4} fontWeight="medium" fontFamily="Geist Mono">
            {intl.formatNumber(refund.amount.amount, {
              minimumFractionDigits: 2,
            })}
          </Text>
        </Box>

        <Button
          variant="secondary"
          icon={<PencilIcon size={16} />}
          onClick={() => onEditRefund?.(refund.id)}
        />
      </Box>
    </Box>
  );
};
