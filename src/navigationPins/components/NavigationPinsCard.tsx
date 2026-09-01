import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { AssignListCard } from "@dashboard/components/AssignListCard/AssignListCard";
import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { pageListUrl } from "@dashboard/modeling/urls";
import { Button } from "@saleor/macaw-ui-next";
import { Pin } from "lucide-react";
import { useState } from "react";
import { useIntl } from "react-intl";

import { useNavigationPinListItems } from "../hooks/useNavigationPinListItems";
import { useNavigationPins } from "../hooks/useNavigationPins";
import { navigationPinMessages as messages } from "../messages";
import { findNavigationPinByItemId } from "../pinListItem";
import { removePin } from "../serialization";

const pinIcon = <Pin size={iconSize.small} strokeWidth={iconStrokeWidth} />;

/**
 * Personal sidebar shortcuts. This is the only place to remove a user pin that is also
 * organization-pinned — the models page hides its button in that case — and to free a
 * slot occupied by a deleted model type.
 */
export const NavigationPinsCard = (): JSX.Element => {
  const intl = useIntl();
  const navigate = useNavigator();
  const notify = useNotifier();
  const userPermissions = useUserPermissions();
  const canViewModels = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PAGES]);
  const { userPins, setUserPins } = useNavigationPins();
  const { items, hasResolved } = useNavigationPinListItems(userPins);
  const [submitting, setSubmitting] = useState(false);
  const hasPins = userPins.length > 0;

  const handleRemove = async (itemId: string): Promise<void> => {
    const pin = findNavigationPinByItemId(userPins, itemId);

    if (!pin) {
      return;
    }

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
    <AssignListCard
      data-test-id="navigation-pins"
      inset="flush"
      title={intl.formatMessage(messages.userPinsTitle)}
      subtitle={
        hasPins
          ? intl.formatMessage(messages.userPinsCount, { count: userPins.length })
          : intl.formatMessage(messages.userPinsNone)
      }
      intro={intl.formatMessage(messages.userPinsDescription)}
      loading={hasPins && !hasResolved}
      items={items.map(item => ({ ...item, icon: pinIcon }))}
      emptyState={{
        icon: pinIcon,
        title: intl.formatMessage(messages.userPinsEmptyTitle),
        description: intl.formatMessage(messages.userPinsEmptyDescription),
      }}
      footerAction={
        !hasPins && canViewModels ? (
          <Button
            variant="secondary"
            type="button"
            data-test-id="navigation-pins-view-models"
            onClick={() => navigate(pageListUrl())}
          >
            {intl.formatMessage(messages.viewModels)}
          </Button>
        ) : undefined
      }
      onRemoveItem={handleRemove}
      removeLabel={intl.formatMessage(messages.unpinFromNav)}
      disabled={submitting}
      rowTestId="navigation-pin-row"
    />
  );
};
