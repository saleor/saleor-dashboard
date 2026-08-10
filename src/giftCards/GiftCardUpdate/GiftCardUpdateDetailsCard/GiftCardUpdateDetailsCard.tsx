import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import GiftCardTagInput from "@dashboard/giftCards/components/GiftCardTagInput";
import { GiftCardUpdateExpirySelect } from "@dashboard/giftCards/GiftCardUpdate/GiftCardUpdateExpirySelect";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import styles from "./GiftCardUpdateDetailsCard.module.css";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

export const GiftCardUpdateDetailsCard = (): JSX.Element => {
  const intl = useIntl();
  const { loading } = useGiftCardDetails();
  const {
    toggleValues,
    data: { tags },
    formErrors,
  } = useGiftCardUpdateForm();

  return (
    <DetailSettingsCard
      title={intl.formatMessage(messages.title)}
      contentFlush
      data-test-id="gift-card-details-card"
    >
      {loading ? (
        <Box className={styles.tagsSection}>
          <Skeleton />
        </Box>
      ) : (
        <>
          <Box className={styles.tagsSection}>
            <GiftCardTagInput
              error={formErrors?.tags}
              name="tags"
              values={tags}
              onChange={toggleValues}
              description={<FormattedMessage {...messages.tagsIntro} />}
              controlWidth="50%"
            />
          </Box>
          <GiftCardUpdateExpirySelect />
        </>
      )}
    </DetailSettingsCard>
  );
};
