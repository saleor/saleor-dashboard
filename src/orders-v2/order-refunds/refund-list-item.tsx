import { getUserInitials } from "@dashboard/misc";
import { Box, Button, PropsWithBox, Text } from "@saleor/macaw-ui-next";
import { PencilIcon } from "lucide-react";
import { useIntl } from "react-intl";

import { UserAvatar } from "../user-avatar";
import { OrderRefundDisplay, OrderRefundsViewModel } from "./order-refunds-view-model";
import { StatusBadge } from "./status-badge";

type RefundListItemProps = PropsWithBox<{
  refund: OrderRefundDisplay;
  onEditRefund: (refundId: string) => void;
}>;

export const RefundListItem = ({ refund, onEditRefund, ...props }: RefundListItemProps) => {
  const intl = useIntl();

  return (
    <Box
      key={refund.id}
      display="grid"
      __gridTemplateColumns="auto 1fr auto"
      alignItems="center"
      gap={7}
      as="li"
      {...props}
    >
      <Box display="flex" alignItems="center" gap={3}>
        {refund.user ? (
          <UserAvatar initials={getUserInitials(refund.user) || ""} />
        ) : (
          <Box width={8} height={8} />
        )}
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
          {/* TODO: This should show reasonReference and reasonNote like order v1 */}
          {refund.type === "manual"
            ? intl.formatMessage({
                defaultMessage: "Manual refund",
                id: "FZTrzW",
              })
            : refund.reasonNote}
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
          onClick={() => onEditRefund(refund.id)}
          disabled={!OrderRefundsViewModel.canEditRefund(refund)}
        />
      </Box>
    </Box>
  );
};
