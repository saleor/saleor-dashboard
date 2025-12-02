import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { Container, FetchMoreProps } from "@dashboard/types";
import { Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";

import BackButton from "../BackButton";
import { useStyles } from "./styles";

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;

interface AssignContainerDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  emptyMessage?: string;
  open: boolean;
}

const scrollableTargetId = "assignContainerScrollableDialog";

export const AssignContainerDialogSingle = (props: AssignContainerDialogSingleProps) => {
  const {
    confirmButtonState,
    containers,
    hasMore,
    loading,
    labels,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedId,
    emptyMessage,
    open,
  } = props;
  const classes = useStyles(props);
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedContainerId, setSelectedContainerId] = useState<string>(selectedId ?? "");

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onClose: handleClose,
  });

  const handleSubmit = () => {
    if (selectedContainerId) {
      const selectedContainer = containers.find(c => c.id === selectedContainerId);

      onSubmit(selectedContainer ? [selectedContainer] : []);
    } else {
      onSubmit([]);
    }
  };

  const handleContainerSelect = (containerId: string) => {
    setSelectedContainerId(containerId === selectedContainerId ? "" : containerId);
  };

  return (
    <>
      <TextField
        name="query"
        value={query}
        onChange={onQueryChange}
        label={labels.label}
        placeholder={labels.placeholder}
        fullWidth
        InputProps={{
          autoComplete: "off",
          endAdornment: loading && <SaleorThrobber size={16} />,
        }}
      />

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={containers?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable>
          <TableBody>
            {!loading && (containers?.length ?? 0) === 0 && (
              <Text>
                <Text>{emptyMessage ?? "No objects found"}</Text>
              </Text>
            )}
            {containers?.map(container => {
              const isSelected = selectedContainerId === container.id;

              return (
                <TableRowLink
                  key={container.id}
                  data-test-id="dialog-row"
                  onClick={() => handleContainerSelect(container.id)}
                >
                  <TableCell padding="checkbox" className={classes.checkboxCell}>
                    <Radio
                      checked={isSelected}
                      onChange={() => handleContainerSelect(container.id)}
                      value={container.id}
                      name="container-selection"
                    />
                  </TableCell>
                  <TableCell className={classes.wideCell} data-test-id={container.name}>
                    {container.name}
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="assign-and-save-button"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels.confirmBtn}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

AssignContainerDialogSingle.displayName = "AssignContainerDialogSingle";
