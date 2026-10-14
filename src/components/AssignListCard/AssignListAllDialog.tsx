import BackButton from "@dashboard/components/BackButton";
import DeletableItem from "@dashboard/components/DeletableItem/DeletableItem";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { AssignPickerListEmptyState } from "../AssignPickerListEmptyState/AssignPickerListEmptyState";
import { AssignPickerListLoading } from "../AssignPickerListLoading/AssignPickerListLoading";
import { type AssignListCardItem } from "./AssignListCard";
import styles from "./AssignListCard.module.css";

const SCROLL_TARGET_ID = "assign-list-all-dialog-body";

interface AssignListAllDialogProps {
  open: boolean;
  title: ReactNode;
  /** Every loaded item; more arrive through `onFetchMore` while `hasMore`. */
  items: AssignListCardItem[];
  loading: boolean;
  hasMore?: boolean;
  onFetchMore?: () => void;
  searchLabel: string;
  searchPlaceholder: string;
  /** Shown when the search matches nothing. */
  noMatchMessage: ReactNode;
  /** Read-only when omitted. */
  removable?: boolean;
  removeLabel?: (item: AssignListCardItem) => string;
  disabled?: boolean;
  onRemoveItem?: (id: string) => void;
  onClose: () => void;
  "data-test-id"?: string;
}

const matchesQuery = (item: AssignListCardItem, query: string): boolean =>
  item.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());

/** The whole assign list behind a card's show-all row: search, scroll and remove. */
export const AssignListAllDialog = ({
  open,
  title,
  items,
  loading,
  hasMore = false,
  onFetchMore,
  searchLabel,
  searchPlaceholder,
  noMatchMessage,
  removable = false,
  removeLabel,
  disabled = false,
  onRemoveItem,
  onClose,
  "data-test-id": dataTestId,
}: AssignListAllDialogProps): ReactNode => {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  const visible = searching ? items.filter(item => matchesQuery(item, query)) : items;

  useModalDialogOpen(open, { onOpen: () => setQuery("") });

  // The API cannot search this list, so a search loads the remaining pages to cover every item.
  useEffect(
    function loadRemainingPagesForSearch() {
      if (open && searching && hasMore && !loading) {
        onFetchMore?.();
      }
    },
    [open, searching, hasMore, loading, onFetchMore],
  );

  const showLoading = visible.length === 0 && (loading || (searching && hasMore));

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="picker" data-test-id={dataTestId}>
        <DashboardModal.PickerHeader
          toolbar={
            <Input
              name="query"
              value={query}
              onChange={event => setQuery(event.target.value)}
              label={searchLabel}
              placeholder={searchPlaceholder}
              autoComplete="off"
              endAdornment={loading ? <SaleorThrobber size={16} /> : null}
            />
          }
        >
          {title}
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill id={SCROLL_TARGET_ID}>
          <InfiniteScroll
            flush
            dataLength={items.length}
            next={() => onFetchMore?.()}
            // An empty or filtered list cannot scroll; the search effect above loads those pages.
            hasMore={!searching && hasMore && items.length > 0}
            scrollThreshold="100px"
            scrollableTarget={SCROLL_TARGET_ID}
          >
            {showLoading ? <AssignPickerListLoading /> : null}
            {!showLoading && visible.length === 0 ? (
              <AssignPickerListEmptyState>{noMatchMessage}</AssignPickerListEmptyState>
            ) : null}
            {visible.length > 0 ? (
              <Box className={styles.allDialogList}>
                {visible.map(item => (
                  <div key={item.id} className={styles.row} data-test-id="assign-list-all-row">
                    <Box className={styles.rowLeading}>
                      {item.icon ? (
                        <Box className={styles.itemIcon} aria-hidden>
                          {item.icon}
                        </Box>
                      ) : null}
                      <Box className={styles.rowCopy}>
                        {item.href ? (
                          <RouterLink to={item.href} className={styles.rowName} onClick={onClose}>
                            <Text size={3} fontWeight="medium">
                              {item.name}
                            </Text>
                          </RouterLink>
                        ) : (
                          <Text size={3} fontWeight="medium">
                            {item.name}
                          </Text>
                        )}
                        {item.description ? (
                          <Text size={2} color="default2">
                            {item.description}
                          </Text>
                        ) : null}
                      </Box>
                    </Box>
                    {removable && onRemoveItem ? (
                      <div className={styles.rowDelete}>
                        <DeletableItem
                          id={item.id}
                          onDelete={onRemoveItem}
                          disabled={disabled}
                          label={removeLabel?.(item)}
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </Box>
            ) : null}
          </InfiniteScroll>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={onClose}>
            <FormattedMessage {...buttonMessages.close} />
          </BackButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
