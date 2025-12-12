import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { Container, FetchMoreProps } from "@dashboard/types";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";
import { useState } from "react";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { useStyles } from "./styles";

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;

interface AssignContainerDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  emptyMessage?: string;
  open: boolean;
}

function handleContainerAssign(
  container: Container,
  isSelected: boolean,
  selectedContainers: Container[],
  setSelectedContainers: (data: Container[]) => void,
) {
  if (isSelected) {
    setSelectedContainers(
      selectedContainers.filter(selectedContainer => selectedContainer.id !== container.id),
    );
  } else {
    setSelectedContainers([...selectedContainers, container]);
  }
}

const scrollableTargetId = "assignContainerScrollableDialog";

export const AssignContainerDialogMulti = (props: AssignContainerDialogMultiProps) => {
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
    emptyMessage,
    open,
  } = props;
  const classes = useStyles(props);
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedContainers, setSelectedContainers] = useState<Container[]>([]);
  const handleSubmit = () => onSubmit(selectedContainers);

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      queryReset();
    },
    onClose: handleClose,
  });

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
              const isSelected = !!selectedContainers.find(
                selectedContainer => selectedContainer.id === container.id,
              );

              return (
                <TableRowLink key={container.id} data-test-id="dialog-row">
                  <TableCell padding="checkbox" className={classes.checkboxCell}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() =>
                        handleContainerAssign(
                          container,
                          isSelected,
                          selectedContainers,
                          setSelectedContainers,
                        )
                      }
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
