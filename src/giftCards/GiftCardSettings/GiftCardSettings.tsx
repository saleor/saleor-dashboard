import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { giftCardsListPath } from "../urls";
import GiftCardSettingsPage from "./GiftCardSettingsPage";
import { useGiftCardSettingsQuery } from "./queries";

interface GiftCardSettingsProps {}

const GiftCardSettings: React.FC<GiftCardSettingsProps> = ({}) => {
  const navigate = useNavigator();

  const { data } = useGiftCardSettingsQuery({});

  const navigateBack = () => navigate(giftCardsListPath);

  return <GiftCardSettingsPage onBack={navigateBack} />;
};

export default GiftCardSettings;
