import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
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
        <Skeleton>{!loading && <GiftCardUpdateInfoCardContent />}</Skeleton>
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateInfoCard;
