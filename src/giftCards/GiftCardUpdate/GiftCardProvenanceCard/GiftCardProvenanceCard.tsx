import { useChannelsQuery } from "@dashboard/graphql";
import { useMemo } from "react";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import { GiftCardProvenanceCardView } from "./GiftCardProvenanceCardView";

export const GiftCardProvenanceCard = (): JSX.Element => {
  const { giftCard, loading } = useGiftCardDetails();
  const { data: channelsData } = useChannelsQuery({
    skip: !giftCard?.boughtInChannel,
  });

  const channel = useMemo(() => {
    const slug = giftCard?.boughtInChannel;

    if (!slug) {
      return null;
    }

    return channelsData?.channels?.find(item => item.slug === slug) ?? null;
  }, [channelsData?.channels, giftCard?.boughtInChannel]);

  return <GiftCardProvenanceCardView giftCard={giftCard} loading={loading} channel={channel} />;
};
