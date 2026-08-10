import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout/TopNav";
import { type TopNavMenuItem } from "@dashboard/components/AppLayout/TopNav/Menu";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForGiftCardDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import { GiftCardStatusChip } from "@dashboard/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { defaultGraphiQLQuery } from "@dashboard/giftCards/GiftCardUpdate/queries";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { giftCardsListPath } from "@dashboard/giftCards/urls";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { GraphqlIcon } from "@dashboard/icons/GraphqlIcon";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { Mail, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import { GiftCardEnableDisableSection } from "./GiftCardEnableDisableSection";
import { giftCardUpdatePageHeaderMessages as messages } from "./messages";

const GiftCardUpdatePageHeader = () => {
  const giftCardBackLink = useBackLinkWithState({
    path: giftCardsListPath,
  });
  const intl = useIntl();
  const { canManageChannels } = useGiftCardPermissions();
  const { giftCard } = useGiftCardDetails();
  const { openResendCodeDialog, openDeleteDialog, openMetadataDialog } = useGiftCardUpdateDialogs();

  const { GIFT_CARD_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.GIFT_CARD_DETAILS);
  const extensionMenuItems = getExtensionsItemsForGiftCardDetails(
    GIFT_CARD_DETAILS_MORE_ACTIONS,
    giftCard?.id,
  );
  const context = useDevModeContext();
  const openPlaygroundURL = useCallback(() => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${giftCard?.id}" }`);
    context.setDevModeVisibility(true);
  }, [context, giftCard?.id]);

  const menuItems = useMemo((): TopNavMenuItem[] => {
    const items: TopNavMenuItem[] = extensionMenuItems.map(item => ({
      label: item.label,
      onSelect: item.onSelect,
      testId: item.testId,
    }));

    const canResendCode = giftCard && !giftCard.isExpired && canManageChannels;

    if (canResendCode) {
      items.push({
        label: intl.formatMessage(messages.resendButtonLabel),
        onSelect: openResendCodeDialog,
        testId: "resend-code",
        icon: <Mail size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    if (giftCard?.id) {
      items.push({
        label: intl.formatMessage(messages.openGraphiQL),
        onSelect: openPlaygroundURL,
        testId: "graphiql-redirect",
        icon: <GraphqlIcon />,
      });
    }

    if (giftCard) {
      items.push({
        label: intl.formatMessage(messages.deleteGiftCard),
        onSelect: openDeleteDialog,
        testId: "delete-gift-card",
        color: "critical1",
        icon: <Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
      });
    }

    return items;
  }, [
    canManageChannels,
    extensionMenuItems,
    giftCard,
    intl,
    openDeleteDialog,
    openPlaygroundURL,
    openResendCodeDialog,
  ]);

  if (!giftCard) {
    return <TopNav title={getStringOrPlaceholder(undefined)} />;
  }

  const { last4CodeChars } = giftCard;
  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    last4CodeChars,
  });

  return (
    <TopNav
      href={giftCardBackLink}
      hrefIcon={<TopNavDestinationIcon.giftCards />}
      hrefTitle={intl.formatMessage(topNavDestinationMessages.allGiftCards)}
      title={
        <Box display="inline-flex" alignItems="center" gap={2}>
          {title}
          <GiftCardStatusChip giftCard={giftCard} />
        </Box>
      }
      actionsGap={3}
    >
      <TopNav.MetadataButton
        onClick={openMetadataDialog}
        disabled={!giftCard}
        data-test-id="show-gift-card-metadata"
        title={intl.formatMessage(messages.editGiftCardMetadata)}
      />
      <GiftCardEnableDisableSection />
      {menuItems.length > 0 && (
        <TopNav.Menu
          items={!giftCard ? menuItems.map(item => ({ ...item, disabled: true })) : menuItems}
          dataTestId="menu"
        />
      )}
    </TopNav>
  );
};

export default GiftCardUpdatePageHeader;
