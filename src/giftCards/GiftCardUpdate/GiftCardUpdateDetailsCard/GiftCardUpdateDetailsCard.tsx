import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import CardSpacer from "@dashboard/components/CardSpacer";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import GiftCardTagInput from "@dashboard/giftCards/components/GiftCardTagInput";
import GiftCardUpdateExpirySelect from "@dashboard/giftCards/GiftCardUpdate/GiftCardUpdateExpirySelect";
import { Divider } from "@material-ui/core";
import { Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsCard: React.FC = () => {
  const intl = useIntl();
  const { loading, giftCard } = useGiftCardDetails();
  const { openSetBalanceDialog } = useGiftCardUpdateDialogs();
  const {
    toggleValues,
    data: { tags },
    formErrors,
  } = useGiftCardUpdateForm();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.title)}</DashboardCard.Title>
        <DashboardCard.Toolbar>
          {!loading && !giftCard?.isExpired && (
            <Button data-test-id="set-balance-button" onClick={openSetBalanceDialog}>
              {intl.formatMessage(messages.setBalanceButtonLabel)}
            </Button>
          )}
        </DashboardCard.Toolbar>
      </DashboardCard.Header>
      <DashboardCard.Content>
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <GiftCardUpdateDetailsBalanceSection />
            <CardSpacer />
            <Divider />
            <CardSpacer />
            <Text color="default2">{intl.formatMessage(messages.tagInputLabel)}</Text>
            <VerticalSpacer />
            <GiftCardTagInput
              error={formErrors?.tags}
              name="tags"
              values={tags}
              onChange={toggleValues}
            />
            <CardSpacer />
            <GiftCardUpdateExpirySelect />
          </>
        )}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default GiftCardUpdateDetailsCard;
