import useNavigator from "@saleor/hooks/useNavigator";
import React from "react";

import { giftCardsListPath } from "../urls";
import GiftCardSettingsPage from "./GiftCardSettingsPage";
import { useGiftCardSettingsUpdateMutation } from "./mutations";
import { useGiftCardSettingsQuery } from "./queries";
import { GiftCardSettingsFormData } from "./types";
import { getGiftCardSettingsInputData } from "./utils";

const GiftCardSettings: React.FC = () => {
  const navigate = useNavigator();

  const { data, loading } = useGiftCardSettingsQuery({});

  const [
    updateGiftCardSettings,
    updateGiftCardSettingsOpts
  ] = useGiftCardSettingsUpdateMutation({});

  const navigateBack = () => navigate(giftCardsListPath);

  const handleSubmit = (formData: GiftCardSettingsFormData) => {
    updateGiftCardSettings({
      variables: {
        input: getGiftCardSettingsInputData(formData)
      }
    });
  };

  return (
    <GiftCardSettingsPage
      data={data?.giftCardSettings}
      onBack={navigateBack}
      onSubmit={handleSubmit}
      disabled={loading || updateGiftCardSettingsOpts?.loading}
      saveButtonBarState={updateGiftCardSettingsOpts?.status}
      errors={updateGiftCardSettingsOpts?.data?.giftCardSettingsUpdate?.errors}
    />
  );
};

export default GiftCardSettings;
