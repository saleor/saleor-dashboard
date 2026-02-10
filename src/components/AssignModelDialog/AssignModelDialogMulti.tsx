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
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { useModalPageFilterContext } from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { ModalFilters } from "../ModalFilters/ModalFilters";
import { messages } from "./messages";

interface AssignModelDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  loading: boolean;
  onFilterChange?: (filterVariables: PageWhereInput, query: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  open: boolean;
}

const scrollableTargetId = "assignModelScrollableDialog";

function handlePageAssign(
  page: { id: string; title: string },
  isSelected: boolean,
  selectedPages: Container[],
  setSelectedPages: (data: Container[]) => void,
) {
  if (isSelected) {
    setSelectedPages(selectedPages.filter(selectedPage => selectedPage.id !== page.id));
  } else {
    setSelectedPages([...selectedPages, { id: page.id, name: page.title }]);
  }
}

export const AssignModelDialogMulti = (props: AssignModelDialogMultiProps) => {
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
    open,
  } = props;
  const intl = useIntl();

  const { combinedFilters, clearFilters } = useModalPageFilterContext();

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: combinedFilters,
    open,
    onFetch: (filters, query) => onFilterChange?.(filters.where, query),
  });

  const [selectedPages, setSelectedPages] = useState<Container[]>([]);

  const handleSubmit = () => onSubmit(selectedPages);

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
              const isSelected = !!selectedPages.find(selectedPage => selectedPage.id === page.id);

              return (
                <TableRowLink key={page.id} data-test-id="dialog-row">
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={loading}
                      onChange={() =>
                        handlePageAssign(page, isSelected, selectedPages, setSelectedPages)
                      }
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
