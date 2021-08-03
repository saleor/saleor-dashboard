import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import ContentOrSkeleton from "@saleor/components/ContentOrSkeleton";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardDetailsContext } from "../providers/GiftCardDetailsProvider";
import GiftCardUpdateInfoCardContent from "./GiftCardUpdateInfoCardContent";
import { giftCardUpdateInfoCardMessages as messages } from "./messages";

const GiftCardUpdateInfoCard: React.FC = () => {
  const intl = useIntl();

  const { loading } = useContext(GiftCardDetailsContext);

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <ContentOrSkeleton condition={!loading}>
          <GiftCardUpdateInfoCardContent />
        </ContentOrSkeleton>
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateInfoCard;
