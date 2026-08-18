import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { removePin } from "../serialization";
import { type NavigationPin } from "../types";
import { NavigationPinList } from "./NavigationPinList";

/**
 * Lives on the account page, which is where "Account Settings" already points. Always lists
 * every user pin — it is the only way to remove one that has since been pinned by the
 * organization, because the models page hides its button in that case.
 */
export const NavigationPinsCard = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const { userPins, setUserPins } = useNavigationPins();
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async (pin: NavigationPin) => {
    setSubmitting(true);

    try {
      await setUserPins(removePin(userPins, pin));
      notify({ status: "success", text: intl.formatMessage(messages.unpinnedSuccess) });
    } catch {
      notify({ status: "error", text: intl.formatMessage(commonMessages.somethingWentWrong) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DetailSettingsCard
      data-test-id="navigation-pins"
      title={intl.formatMessage(messages.userPinsTitle)}
      intro={
        <Text size={3} color="default2">
          {intl.formatMessage(messages.userPinsDescription)}
        </Text>
      }
    >
      <NavigationPinList
        pins={userPins}
        emptyMessage={intl.formatMessage(messages.userPinsEmpty)}
        disabled={submitting}
        onRemove={handleRemove}
      />
    </DetailSettingsCard>
  );
};
