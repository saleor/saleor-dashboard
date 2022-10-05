import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "./../messages";

interface CreateVariantTitleProps {
  onManageClick: () => void;
}

export const CreateVariantTitle: React.FC<CreateVariantTitleProps> = ({
  onManageClick,
}) => {
  const intl = useIntl();

  return (
    <CardTitle
      title={intl.formatMessage(messages.title)}
      toolbar={
        <Button variant="tertiary" disabled={false} onClick={onManageClick}>
          {intl.formatMessage(messages.manageButtonText)}
        </Button>
      }
    />
  );
};
