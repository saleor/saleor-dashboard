import useNotifier from "@saleor/hooks/useNotifier";
import { getDefaultNotifierSuccessErrorData } from "@saleor/hooks/useNotifier/utils";
import { commonMessages } from "@saleor/intl";
import { ConfirmButton } from "@saleor/macaw-ui";
import commonErrorMessages from "@saleor/utils/errors/common";
import classNames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";

import { GiftCardDetailsContext } from "../providers/GiftCardDetailsProvider";
import { giftCardEnableDisableSectionMessages as messages } from "./messages";
import {
  useGiftCardActivateMutation,
  useGiftCardDeactivateMutation
} from "./mutations";
import { useGiftCardEnableDisableSectionStyles as useStyles } from "./styles";
import { GiftCardActivate } from "./types/GiftCardActivate";
import { GiftCardDeactivate } from "./types/GiftCardDeactivate";

const GiftCardEnableDisableSection: React.FC = () => {
  const classes = useStyles({});
  const notify = useNotifier();
  const intl = useIntl();

  const {
    giftCard: { id, isActive }
  } = useContext(GiftCardDetailsContext);

  const [showButtonGreen, setShowButtonGreen] = useState(!isActive);

  useEffect(() => setShowButtonGreen(!isActive), [isActive]);

  const onActivateCompleted = (data: GiftCardActivate) => {
    const errors = data?.giftCardActivate?.errors;

    if (!!errors?.length) {
      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      });

      setShowButtonGreen(false);
      setTimeout(() => setShowButtonGreen(true), 3000);
      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.successfullyEnabledTitle)
    });
  };

  const onDeactivateCompleted = (data: GiftCardDeactivate) => {
    const errors = data?.giftCardDeactivate?.errors;

    if (!!errors?.length) {
      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError)
      });
      return;
    }

    notify({
      status: "success",
      text: intl.formatMessage(messages.successfullyDisabledTitle)
    });
  };

  const [giftCardActivate, giftCardActivateOpts] = useGiftCardActivateMutation({
    onCompleted: onActivateCompleted
  });

  const [
    giftCardDeactivate,
    giftCardDeactivateOpts
  ] = useGiftCardDeactivateMutation({
    onCompleted: onDeactivateCompleted
  });

  const handleClick = () =>
    isActive
      ? giftCardDeactivate({ variables: { id } })
      : giftCardActivate({ variables: { id: "lol" } });

  const buttonLabel = isActive ? messages.disableLabel : messages.enableLabel;

  const currentOpts = isActive ? giftCardDeactivateOpts : giftCardActivateOpts;

  return (
    <ConfirmButton
      className={classNames(classes.button, {
        [classes.buttonRed]: isActive || currentOpts?.status === "error",
        [classes.buttonGreen]: showButtonGreen
      })}
      onClick={handleClick}
      transitionState={currentOpts?.status}
      labels={{
        confirm: intl.formatMessage(buttonLabel),
        error: intl.formatMessage(commonMessages.error)
      }}
    />
  );
};

export default GiftCardEnableDisableSection;
