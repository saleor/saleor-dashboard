import { Button } from "@dashboard/components/Button";
import CardTitle from "@dashboard/components/CardTitle";
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
        <Button
          variant="tertiary"
          data-test-id="manage-channels-button"
          disabled={false}
          onClick={onManageClick}
        >
          {intl.formatMessage(messages.manageButtonText)}
        </Button>
      }
    />
  );
};
