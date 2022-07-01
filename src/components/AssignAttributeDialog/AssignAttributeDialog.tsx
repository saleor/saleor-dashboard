import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { AvailableAttributeFragment } from "@saleor/graphql";
import useElementScroll, {
  isScrolledToBottom,
} from "@saleor/hooks/useElementScroll";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    actions: {
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    checkboxCell: {
      paddingLeft: 0,
    },
    dialogPaper: {
      overflow: "hidden",
    },
    dropShadow: {
      boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`,
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      marginTop: theme.spacing(2),
      height: theme.spacing(3),
      justifyContent: "center",
    },
    searchArea: {
      marginBottom: theme.spacing(3),
      overflowY: "hidden",
      paddingBottom: theme.spacing(6),
    },
    scrollArea: {
      maxHeight: 700,
      overflowY: "scroll",
      paddingTop: 0,
      marginBottom: theme.spacing(3),
    },
    wideCell: {
      width: "100%",
    },
  }),
  { name: "AssignAttributeDialog" },
);

export interface AssignAttributeDialogProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: string[];
  open: boolean;
  attributes: AvailableAttributeFragment[];
  selected: string[];
  onClose: () => void;
  onFetch: (query: string) => void;
  onOpen: () => void;
  onSubmit: () => void;
  onToggle: (id: string) => void;
}

const scrollableTargetId = "assignAttributeScrollableDialog";

const AssignAttributeDialog: React.FC<AssignAttributeDialogProps> = ({
  attributes,
  confirmButtonState,
  errors: apiErrors,
  hasMore,
  loading,
  open,
  selected,
  onClose,
  onFetch,
  onFetchMore,
  onOpen,
  onSubmit,
  onToggle,
}: AssignAttributeDialogProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const errors = useModalDialogErrors(apiErrors, open);
  const anchor = React.useRef(null);
  const position = useElementScroll(anchor);

  useModalDialogOpen(open, {
    onClose: resetQuery,
    onOpen,
  });

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
      classes={{
        paper: classes.dialogPaper,
      }}
    >
      <DialogTitle>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent className={classes.searchArea}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.searchInputLabel)}
          placeholder={intl.formatMessage(messages.searchInputPlaceholder)}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />,
          }}
        />
      </DialogContent>
      <DialogContent
        className={classes.scrollArea}
        ref={anchor}
        id={scrollableTargetId}
      >
        <InfiniteScroll
          dataLength={attributes?.length || 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          loader={
            <div className={classes.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          scrollableTarget={scrollableTargetId}
        >
          <ResponsiveTable key="table">
            <TableBody>
              {renderCollection(
                attributes,
                attribute => {
                  if (!attribute) {
                    return null;
                  }
                  const isChecked = !!selected.find(
                    selectedAttribute => selectedAttribute === attribute.id,
                  );

                  return (
                    <TableRow key={maybe(() => attribute.id)}>
                      <TableCell
                        padding="checkbox"
                        className={classes.checkboxCell}
                      >
                        <Checkbox
                          checked={isChecked}
                          onChange={() => onToggle(attribute.id)}
                        />
                      </TableCell>
                      <TableCell className={classes.wideCell}>
                        {attribute.name}
                        <Typography variant="caption">
                          {attribute.slug}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                },
                () =>
                  !loading && (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <FormattedMessage {...messages.noMembersFound} />
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </ResponsiveTable>
        </InfiniteScroll>
      </DialogContent>
      {errors.length > 0 && (
        <DialogContent>
          {errors.map((error, errorIndex) => (
            <DialogContentText color="error" key={errorIndex}>
              {error}
            </DialogContentText>
          ))}
        </DialogContent>
      )}
      <DialogActions
        className={classNames(classes.actions, {
          [classes.dropShadow]: !isScrolledToBottom(anchor, position),
        })}
      >
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          type="submit"
          onClick={onSubmit}
        >
          <FormattedMessage {...messages.assignButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignAttributeDialog.displayName = "AssignAttributeDialog";
export default AssignAttributeDialog;
