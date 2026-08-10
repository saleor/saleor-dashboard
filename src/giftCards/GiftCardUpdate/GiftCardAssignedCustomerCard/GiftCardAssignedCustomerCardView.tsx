import { AssignListCard } from "@dashboard/components/AssignListCard/AssignListCard";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { customerUrl } from "@dashboard/customers/urls";
import { type GiftCardDetailsQuery } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { Button } from "@saleor/macaw-ui-next";
import { Mail, User } from "lucide-react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";

import { type ExtendedGiftCard } from "../providers/GiftCardDetailsProvider/types";
import { giftCardAssignedCustomerCardMessages as messages } from "./messages";

type GiftCardDetails = NonNullable<GiftCardDetailsQuery["giftCard"]>;

const EMAIL_ONLY_ITEM_ID = "assigned-to-email";

const customerIcon = <User size={iconSize.small} strokeWidth={iconStrokeWidth} />;
const emailIcon = <Mail size={iconSize.small} strokeWidth={iconStrokeWidth} />;

export interface GiftCardAssignedCustomerCardViewProps {
  giftCard: ExtendedGiftCard<GiftCardDetails> | undefined;
  loading?: boolean;
  removing?: boolean;
  onAssign: () => void;
  onRemove: () => void;
}

export const GiftCardAssignedCustomerCardView = ({
  giftCard,
  loading = false,
  removing = false,
  onAssign,
  onRemove,
}: GiftCardAssignedCustomerCardViewProps): JSX.Element => {
  const items = useMemo(() => {
    if (!giftCard) {
      return [];
    }

    if (giftCard.assignedTo) {
      const name =
        getFullName(giftCard.assignedTo) || giftCard.assignedToEmail || giftCard.assignedTo.id;

      return [
        {
          id: giftCard.assignedTo.id,
          name,
          href: customerUrl(giftCard.assignedTo.id),
          icon: customerIcon,
        },
      ];
    }

    if (giftCard.assignedToEmail) {
      return [
        {
          id: EMAIL_ONLY_ITEM_ID,
          name: giftCard.assignedToEmail,
          icon: emailIcon,
        },
      ];
    }

    return [];
  }, [giftCard]);

  const isAssigned = items.length > 0;
  const isEmailOnly = Boolean(giftCard?.assignedToEmail && !giftCard.assignedTo);
  const disabled = loading || !giftCard || removing;

  return (
    <AssignListCard
      title={<FormattedMessage {...messages.title} />}
      subtitle={
        <FormattedMessage
          {...(isAssigned ? messages.subtitleAssigned : messages.subtitleUnassigned)}
        />
      }
      intro={
        <FormattedMessage
          {...(isEmailOnly ? messages.introEmailOnly : messages.intro)}
          values={isEmailOnly ? { email: giftCard?.assignedToEmail } : undefined}
        />
      }
      items={items}
      emptyState={{
        icon: customerIcon,
        title: <FormattedMessage {...messages.emptyTitle} />,
        description: <FormattedMessage {...messages.emptyDescription} />,
      }}
      footerAction={
        <Button
          variant="secondary"
          onClick={onAssign}
          disabled={disabled}
          data-test-id="assign-customer"
        >
          <FormattedMessage {...(isAssigned ? messages.changeButton : messages.assignButton)} />
        </Button>
      }
      onRemoveItem={onRemove}
      disabled={disabled}
      data-test-id="gift-card-assigned-customer-card"
      rowTestId="gift-card-assigned-customer-row"
    />
  );
};
