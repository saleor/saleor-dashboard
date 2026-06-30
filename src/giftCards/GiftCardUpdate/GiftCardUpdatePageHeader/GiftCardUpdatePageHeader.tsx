import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForGiftCardDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import GiftCardStatusChip from "@dashboard/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { defaultGraphiQLQuery } from "@dashboard/giftCards/GiftCardUpdate/queries";
import { useGiftCardPermissions } from "@dashboard/giftCards/hooks/useGiftCardPermissions";
import { giftCardsListPath } from "@dashboard/giftCards/urls";
import { useBackLinkWithState } from "@dashboard/hooks/useBackLinkWithState";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Button } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import GiftCardEnableDisableSection from "./GiftCardEnableDisableSection";
import { giftCardUpdatePageHeaderMessages as messages } from "./messages";
import useStyles from "./styles";

const GiftCardUpdatePageHeader = () => {
  const classes = useStyles();
  const giftCardBackLink = useBackLinkWithState({
    path: giftCardsListPath,
  });
  const intl = useIntl();
  const { canManageChannels } = useGiftCardPermissions();
  const { giftCard } = useGiftCardDetails();
  const { openResendCodeDialog } = useGiftCardUpdateDialogs();

  const { GIFT_CARD_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.GIFT_CARD_DETAILS);
  const extensionMenuItems = getExtensionsItemsForGiftCardDetails(
    GIFT_CARD_DETAILS_MORE_ACTIONS,
    giftCard?.id,
  );
  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(defaultGraphiQLQuery);
    context.setVariables(`{ "id": "${giftCard?.id}" }`);
    context.setDevModeVisibility(true);
  };

  if (!giftCard) {
    return <TopNav title={getStringOrPlaceholder(undefined)} />;
  }

  const { last4CodeChars, isExpired } = giftCard;
  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    last4CodeChars,
  });

  const canResendCode = !isExpired && canManageChannels;

  return (
    <>
      <TopNav
        href={giftCardBackLink}
        title={
          <div className={classes.title}>
            {title}
            <HorizontalSpacer spacing={2} />
            <GiftCardStatusChip giftCard={giftCard} />
          </div>
        }
      >
        <GiftCardEnableDisableSection />
        <HorizontalSpacer />
        {canResendCode && (
          <Button
            marginLeft={2}
            variant="primary"
            onClick={openResendCodeDialog}
            data-test-id="resend-code"
          >
            {intl.formatMessage(messages.resendButtonLabel)}
          </Button>
        )}
        <HorizontalSpacer />
        <TopNav.Menu
          items={[
            ...extensionMenuItems,
            {
              label: intl.formatMessage(messages.openGraphiQL),
              onSelect: openPlaygroundURL,
              testId: "graphiql-redirect",
            },
          ]}
          dataTestId="menu"
        />
      </TopNav>
    </>
  );
};

export default GiftCardUpdatePageHeader;
