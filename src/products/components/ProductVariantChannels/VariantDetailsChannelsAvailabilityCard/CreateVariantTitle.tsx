import { Button } from "@saleor/components/Button";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { useIntl } from "react-intl";

import { variantDetailsChannelsAvailabilityCardMessages as messages } from "../messages";

export const CreateVariantTitle: React.FC = ({ onManageClick }) => {
  const intl = useIntl();

  return (
    <CardTitle
      title={intl.formatMessage(messages.title)}
      toolbar={
        <Button variant="tertiary" disabled={false} onClick={onManageClick}>
          {/* {intl.formatMessage()} */}
          Manage
        </Button>
      }
    />
  );
};
