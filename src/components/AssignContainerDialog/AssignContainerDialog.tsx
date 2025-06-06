import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { DialogProps, FetchMoreProps, Node } from "@dashboard/types";
import { CircularProgress, TableBody, TableCell, TextField } from "@material-ui/core";
import React from "react";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { ConfirmButton } from "../ConfirmButton";
import { useStyles } from "./styles";

export interface AssignContainerDialogFormData {
  containers: string[];
  query: string;
}

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;
export interface Container extends Node {
  name: string;
}
export interface AssignContainerDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
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
const AssignContainerDialog: React.FC<AssignContainerDialogProps> = props => {
  const {
    confirmButtonState,
    containers,
    hasMore,
    loading,
    open,
    labels,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const [query, onQueryChange, queryReset] = useSearchQuery(onFetch);
  const [selectedContainers, setSelectedContainers] = React.useState<Container[]>([]);
  const handleSubmit = () => onSubmit(selectedContainers);
  const handleClose = () => {
    queryReset();
    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>

        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={labels.label}
          placeholder={labels.placeholder}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
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
          <BackButton onClick={onClose} />
          <ConfirmButton
            data-test-id="assign-and-save-button"
            transitionState={confirmButtonState}
            type="submit"
            onClick={handleSubmit}
          >
            {labels.confirmBtn}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";
export default AssignContainerDialog;
