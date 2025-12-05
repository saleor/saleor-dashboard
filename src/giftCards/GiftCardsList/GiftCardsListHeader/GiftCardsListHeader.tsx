import { useContextualLink } from "@dashboard/components/AppLayout/ContextualLinks/useContextualLink";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ButtonGroupWithDropdown } from "@dashboard/components/ButtonGroupWithDropdown";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import {
  getExtensionItemsForOverviewCreate,
  getExtensionsItemsForGiftCardOverviewActions,
} from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Box, Button } from "@saleor/macaw-ui-next";
import { ChevronRight } from "lucide-react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";

const GiftCardsListHeader = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const subtitle = useContextualLink("gift_cards");

  const {
    openCreateDialog,
    openBulkCreateDialog,
    openExportDialog,
    openSearchDeleteDialog,
    openSearchSaveDialog,
  } = useGiftCardListDialogs();
  const {
    hasPresetsChanged,
    selectedPreset,
    presets,
    onPresetUpdate,
    setPresetIdToDelete,
    onPresetChange,
    resetFilters,
    isFilterPresetOpen,
    setFilterPresetOpen,
    selectedRowIds,
  } = useGiftCardList();
  const openSettings = () => navigate(giftCardSettingsUrl);

  const { GIFT_CARD_OVERVIEW_CREATE, GIFT_CARD_OVERVIEW_MORE_ACTIONS } = useExtensions(
    extensionMountPoints.GIFT_CARD_LIST,
  );

  const extensionMenuItems = getExtensionsItemsForGiftCardOverviewActions(
    GIFT_CARD_OVERVIEW_MORE_ACTIONS,
    selectedRowIds,
  );
  const extensionCreateButtonItems = getExtensionItemsForOverviewCreate(GIFT_CARD_OVERVIEW_CREATE);

  return (
    <>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(sectionNames.giftCards)}
        subtitle={subtitle}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRight />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onPresetChange}
              onRemove={(id: number) => {
                setPresetIdToDelete(id);
                openSearchDeleteDialog();
              }}
              onUpdate={onPresetUpdate}
              savedPresets={presets.map(preset => preset.name)}
              activePreset={selectedPreset}
              onSelectAll={resetFilters}
              onSave={openSearchSaveDialog}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "7EDqed",
                defaultMessage: "All gift cards",
                description: "tab name",
              })}
            />
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <TopNav.Menu
              items={[
                {
                  label: intl.formatMessage(messages.settings),
                  testId: "settingsMenuItem",
                  onSelect: openSettings,
                },
                {
                  label: intl.formatMessage(messages.bulkIssue),
                  testId: "bulkIssueMenuItem",
                  onSelect: openBulkCreateDialog,
                },
                {
                  label: intl.formatMessage(messages.exportCodes),
                  testId: "exportCodesMenuItem",
                  onSelect: openExportDialog,
                },
                ...extensionMenuItems,
              ]}
              data-test-id="menu"
            />
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonGroupWithDropdown
                options={extensionCreateButtonItems}
                data-test-id="issue-card-button"
                onClick={openCreateDialog}
              >
                {intl.formatMessage(messages.issueButtonLabel)}
              </ButtonGroupWithDropdown>
            ) : (
              <Button data-test-id="issue-card-button" onClick={openCreateDialog}>
                {intl.formatMessage(messages.issueButtonLabel)}
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
    </>
  );
};

export default GiftCardsListHeader;
