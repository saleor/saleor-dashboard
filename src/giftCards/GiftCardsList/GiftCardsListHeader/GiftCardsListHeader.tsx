import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Button } from "@dashboard/components/Button";
import CardMenu, { CardMenuItem } from "@dashboard/components/CardMenu";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import HorizontalSpacer from "@dashboard/components/HorizontalSpacer";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui/next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { giftCardSettingsUrl } from "../../urls";
import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import GiftCardsListHeaderAlert from "./GiftCardsListHeaderAlert";

const GiftCardsListHeader: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();

  const {
    openCreateDialog,
    openBulkCreateDialog,
    openExportDialog,
    openSearchDeleteDialog,
    openSearchSaveDialog,
  } = useGiftCardListDialogs();
  const {
    hasPresetsChange,
    selectedPreset,
    presets,
    onPresetUpdate,
    setPresetIdToDelete,
    onPresetChange,
    resetFilters,
  } = useGiftCardList();

  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const openSettings = () => navigate(giftCardSettingsUrl);

  const menuItems: CardMenuItem[] = [
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
  ];

  return (
    <>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(sectionNames.giftCards)}
      >
        <Box
          __flex={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>

            <FilterPresetsSelect
              presetsChanged={hasPresetsChange()}
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
            <CardMenu menuItems={menuItems} data-test-id="menu" />
            <HorizontalSpacer spacing={2} />
            <Button
              variant="primary"
              onClick={openCreateDialog}
              data-test-id="issue-card-button"
            >
              {intl.formatMessage(messages.issueButtonLabel)}
            </Button>
          </Box>
        </Box>
      </TopNav>
      <GiftCardsListHeaderAlert />
    </>
  );
};

export default GiftCardsListHeader;
