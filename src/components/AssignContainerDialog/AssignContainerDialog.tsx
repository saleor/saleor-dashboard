import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField
} from "@material-ui/core";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { makeStyles } from "@saleor/theme";
import { FetchMoreProps, Node } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage } from "react-intl";

import Checkbox from "../Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";

export interface FormData {
  containers: string[];
  query: string;
}

const useStyles = makeStyles(
  {
    avatar: {
      "&:first-child": {
        paddingLeft: 0
      }
    },
    checkboxCell: {
      paddingLeft: 0
    },
    wideCell: {
      width: "100%"
    }
  },
  { name: "AssignContainerDialog" }
);

interface Container extends Node {
  name: string;
}
export interface AssignContainerDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  open: boolean;
  search: Record<"label" | "placeholder", string>;
  title: string;
  onClose: () => void;
  onFetch: (value: string) => void;
  onSubmit: (data: string[]) => void;
}

function handleContainerAssign(
  containerId: string,
  isSelected: boolean,
  selectedContainers: string[],
  setSelectedContainers: (data: string[]) => void
) {
  if (isSelected) {
    setSelectedContainers(
      selectedContainers.filter(
        selectedContainer => selectedContainer !== containerId
      )
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
    search,
    title,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [selectedContainers, setSelectedContainers] = React.useState<string[]>(
    []
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
      <DialogTitle>{title}</DialogTitle>
      <DialogContent className={scrollableDialogClasses.topArea}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={search.label}
          placeholder={search.placeholder}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
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
                  selectedContainer => selectedContainer === container.id
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
                            setSelectedContainers
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
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          type="submit"
          onClick={handleSubmit}
        >
          <FormattedMessage defaultMessage="Assign" description="button" />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignContainerDialog.displayName = "AssignContainerDialog";
export default AssignContainerDialog;
