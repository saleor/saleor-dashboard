import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { DialogProps, FetchMoreProps, Node } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import ConfirmButton from "../ConfirmButton";
import { useStyles } from "./styles";

export interface AssignContainerDialogFormData {
  containers: string[];
  query: string;
}

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;
interface Container extends Node {
  name: string;
}
export interface AssignContainerDialogProps
  extends FetchMoreProps,
    DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: string[]) => void;
}

function handleContainerAssign(
  containerId: string,
  isSelected: boolean,
  selectedContainers: string[],
  setSelectedContainers: (data: string[]) => void,
) {
  if (isSelected) {
    setSelectedContainers(
      selectedContainers.filter(
        selectedContainer => selectedContainer !== containerId,
      ),
    );
  } else {
    setSelectedContainers([...selectedContainers, containerId]);
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
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [selectedContainers, setSelectedContainers] = React.useState<string[]>(
    [],
  );

  const handleSubmit = () => onSubmit(selectedContainers);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{labels.title}</DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogContent
        className={scrollableDialogClasses.scrollArea}
        id={scrollableTargetId}
      >
        <InfiniteScroll
          dataLength={containers?.length}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable>
            <TableBody>
              {containers?.map(container => {
                const isSelected = !!selectedContainers.find(
                  selectedContainer => selectedContainer === container.id,
                );

                return (
                  <TableRow key={container.id}>
                    <TableCell
                      padding="checkbox"
                      className={classes.checkboxCell}
                    >
                      <Checkbox
                        checked={isSelected}
                        onChange={() =>
                          handleContainerAssign(
                            container.id,
                            isSelected,
                            selectedContainers,
                            setSelectedContainers,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.wideCell}>
                      {container.name}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
      </DialogContent>
      <DialogActions>
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels.confirmBtn}
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignContainerDialog.displayName = "AssignContainerDialog";
export default AssignContainerDialog;
