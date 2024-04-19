// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AvailableAttributeFragment } from "@dashboard/graphql";
import useElementScroll, { isScrolledToBottom } from "@dashboard/hooks/useElementScroll";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe, renderCollection } from "@dashboard/misc";
import { FetchMoreProps } from "@dashboard/types";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
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
      <DialogTitle disableTypography>
        <FormattedMessage {...messages.title} />
      </DialogTitle>
      <DialogContent className={classes.searchArea}>
        <TextField
          data-test-id="attribute-search-input"
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
      <DialogContent className={classes.scrollArea} ref={anchor} id={scrollableTargetId}>
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
            <TableBody data-test-id="attributes-list">
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
                    <TableRowLink key={maybe(() => attribute.id)}>
                      <TableCell padding="checkbox" className={classes.checkboxCell}>
                        <Checkbox checked={isChecked} onChange={() => onToggle(attribute.id)} />
                      </TableCell>
                      <TableCell className={classes.wideCell}>
                        {attribute.name}
                        <Typography variant="caption">{attribute.slug}</Typography>
                      </TableCell>
                    </TableRowLink>
                  );
                },
                () =>
                  !loading && (
                    <TableRowLink>
                      <TableCell colSpan={2}>
                        <FormattedMessage {...messages.noMembersFound} />
                      </TableCell>
                    </TableRowLink>
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
        className={clsx(classes.actions, {
          [classes.dropShadow]: !isScrolledToBottom(anchor, position),
        })}
      >
        <BackButton onClick={onClose} />
        <ConfirmButton
          transitionState={confirmButtonState}
          type="submit"
          onClick={onSubmit}
          data-test-id="assign-and-save-button"
        >
          <FormattedMessage {...messages.assignButton} />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};

AssignAttributeDialog.displayName = "AssignAttributeDialog";
export default AssignAttributeDialog;
