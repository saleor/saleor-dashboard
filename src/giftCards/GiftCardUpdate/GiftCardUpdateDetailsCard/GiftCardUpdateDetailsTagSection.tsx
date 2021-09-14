import { Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import { PLACEHOLDER } from "../types";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsTagSection: React.FC = ({}) => {
  const intl = useIntl();

  const { giftCard } = useGiftCardDetails();

  const {
    change,
    data: { tag },
    formErrors
  } = useGiftCardUpdateForm();

  return (
    <>
      <Typography>{intl.formatMessage(messages.tagInputLabel)}</Typography>
      <VerticalSpacer />
      {giftCard?.isExpired ? (
        <Typography color="textSecondary">{tag || PLACEHOLDER}</Typography>
      ) : (
        <GiftCardTagInput
          error={formErrors?.tag}
          name="tag"
          value={tag}
          change={change}
        />
      )}
    </>
  );
};

export default GiftCardUpdateDetailsTagSection;
