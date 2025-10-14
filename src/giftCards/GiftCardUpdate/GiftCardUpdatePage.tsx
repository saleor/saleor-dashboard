import CardSpacer from "@dashboard/components/CardSpacer";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Metadata } from "@dashboard/components/Metadata";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import useGiftCardDetails from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Divider } from "@saleor/macaw-ui-next";

import { giftCardsListPath } from "../urls";
import GiftCardHistory from "./GiftCardHistory/GiftCardHistory";
import GiftCardUpdateDetailsCard from "./GiftCardUpdateDetailsCard";
import GiftCardUpdateInfoCard from "./GiftCardUpdateInfoCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";
import useGiftCardUpdateDialogs from "./providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdate from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate";
import useGiftCardUpdateForm from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";

const GiftCardUpdatePage = () => {
  const { openDeleteDialog } = useGiftCardUpdateDialogs();
  const navigate = useNavigator();
  const {
    submit,
    data,
    handlers: { changeMetadata },
  } = useGiftCardUpdateForm();
  const {
    opts: { loading: loadingUpdate, status },
  } = useGiftCardUpdate();

  const { GIFT_CARD_DETAILS_WIDGETS } = useExtensions(extensionMountPoints.GIFT_CARD_DETAILS);
  const { giftCard } = useGiftCardDetails();

  return (
    <DetailPageLayout>
      <GiftCardUpdatePageHeader />
      <DetailPageLayout.Content>
        <GiftCardUpdateDetailsCard />
        <CardSpacer />
        <Metadata data={data} onChange={changeMetadata} />
        <GiftCardHistory />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <GiftCardUpdateInfoCard />
        {GIFT_CARD_DETAILS_WIDGETS.length > 0 && giftCard?.id && (
          <>
            <CardSpacer />
            <Divider />
            <AppWidgets
              extensions={GIFT_CARD_DETAILS_WIDGETS}
              params={{ giftCardId: giftCard.id }}
            />
          </>
        )}
      </DetailPageLayout.RightSidebar>

      <Savebar>
        <Savebar.DeleteButton onClick={openDeleteDialog} />
        <Savebar.Spacer />
        <Savebar.CancelButton onClick={() => navigate(giftCardsListPath)} />
        <Savebar.ConfirmButton transitionState={status} onClick={submit} disabled={loadingUpdate} />
      </Savebar>
    </DetailPageLayout>
  );
};

export default GiftCardUpdatePage;
