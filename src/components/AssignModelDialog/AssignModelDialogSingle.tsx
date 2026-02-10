// @ts-strict-ignore
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResponsiveTable } from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { PageWhereInput, SearchPagesQuery } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { Container, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import { useModalPageFilterContext } from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

interface AssignModelDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  loading: boolean;
  onFilterChange?: (filterVariables: PageWhereInput, query: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
}

const scrollableTargetId = "assignModelScrollableDialog";

export const AssignModelDialogSingle = (props: AssignModelDialogSingleProps) => {
  const {
    confirmButtonState,
    labels,
    hasMore,
    loading,
    pages,
    onClose,
    onFilterChange,
    onFetchMore,
    onSubmit,
    selectedId,
    open,
  } = props;
  const intl = useIntl();
  const [selectedPageId, setSelectedPageId] = useState<string>(selectedId ?? "");

  const { combinedFilters, clearFilters } = useModalPageFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, query),
  });

  const handleClose = () => {
    resetQuery();
    clearFilters();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      resetQuery();
      clearFilters();
    },
    onClose: handleClose,
  });

  const handleSubmit = () => {
    if (selectedPageId) {
      const selectedPage = pages?.find(p => p.id === selectedPageId);

      if (selectedPage) {
        onSubmit([
          {
            id: selectedPage.id,
            name: selectedPage.title,
          },
        ]);

        return;
      }
    }

    onSubmit([]);
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId === selectedPageId ? "" : pageId);
  };

  return (
    <>
      <TextField
        name="query"
        value={query}
        onChange={onQueryChange}
        label={labels?.label ?? intl.formatMessage(messages.assignModelDialogSearch)}
        placeholder={labels?.placeholder ?? intl.formatMessage(messages.assignModelDialogContent)}
        fullWidth
        InputProps={{
          autoComplete: "off",
          endAdornment: loading && <SaleorThrobber size={16} />,
        }}
      />

      <ModalFilters />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={pages?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable>
          <TableBody>
            {!loading && (pages?.length ?? 0) === 0 && (
              <Text>
                <Text>
                  {query
                    ? intl.formatMessage(messages.noModelsFound)
                    : intl.formatMessage(messages.noModelsAvailable)}
                </Text>
              </Text>
            )}
            {pages?.map(page => {
              const isSelected = selectedPageId === page.id;

              return (
                <TableRowLink
                  key={page.id}
                  data-test-id="dialog-row"
                  onClick={() => handlePageSelect(page.id)}
                >
                  <TableCell padding="checkbox">
                    <Radio
                      checked={isSelected}
                      disabled={loading}
                      onChange={() => handlePageSelect(page.id)}
                      value={page.id}
                      name="page-selection"
                    />
                  </TableCell>
                  <TableCell data-test-id={page.title}>{page.title}</TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignModelDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};
