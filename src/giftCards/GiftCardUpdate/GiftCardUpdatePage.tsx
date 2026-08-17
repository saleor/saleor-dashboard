import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import useGiftCardDetails from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box, Divider } from "@saleor/macaw-ui-next";

import { giftCardsListPath } from "../urls";
import { GiftCardAssignedCustomerCard } from "./GiftCardAssignedCustomerCard/GiftCardAssignedCustomerCard";
import { GiftCardBalanceCard } from "./GiftCardBalanceCard/GiftCardBalanceCard";
import { GiftCardHistory } from "./GiftCardHistory/GiftCardHistory";
import { GiftCardProvenanceCard } from "./GiftCardProvenanceCard/GiftCardProvenanceCard";
import { GiftCardSaveCompositionHint } from "./GiftCardSaveCompositionHint";
import { GiftCardUpdateDetailsCard } from "./GiftCardUpdateDetailsCard/GiftCardUpdateDetailsCard";
import GiftCardUpdatePageHeader from "./GiftCardUpdatePageHeader";
import useGiftCardUpdate from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate";
import useGiftCardUpdateForm from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";

const GiftCardUpdatePage = () => {
  const navigate = useNavigator();
  const { submit, saveComposition, isSaveDisabled } = useGiftCardUpdateForm();
  const {
    opts: { loading: loadingUpdate, status },
  } = useGiftCardUpdate();

  const { GIFT_CARD_DETAILS_WIDGETS } = useExtensions(extensionMountPoints.GIFT_CARD_DETAILS);
  const { giftCard } = useGiftCardDetails();

  return (
    <DetailPageLayout>
      <GiftCardUpdatePageHeader />
      <DetailPageLayout.Content>
        <DetailPageContent>
          <GiftCardBalanceCard />
          <GiftCardUpdateDetailsCard />
          <GiftCardHistory />
        </DetailPageContent>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <Box display="flex" flexDirection="column" gap={4} paddingY={6}>
          <GiftCardAssignedCustomerCard />
          <GiftCardProvenanceCard />
          {GIFT_CARD_DETAILS_WIDGETS.length > 0 && giftCard?.id && (
            <>
              <Divider />
              <AppWidgets
                extensions={GIFT_CARD_DETAILS_WIDGETS}
                params={{ giftCardId: giftCard.id }}
              />
            </>
          )}
        </Box>
      </DetailPageLayout.RightSidebar>

      <Savebar>
        <Savebar.Spacer />
        <GiftCardSaveCompositionHint composition={saveComposition} />
        <Savebar.CancelButton onClick={() => navigate(giftCardsListPath)} />
        <Savebar.ConfirmButton
          transitionState={status}
          onClick={submit}
          disabled={isSaveDisabled || loadingUpdate}
        />
      </Savebar>
    </DetailPageLayout>
  );
};

export default GiftCardUpdatePage;
