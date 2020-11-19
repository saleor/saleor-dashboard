import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { AvailableAttributeFragment } from "@saleor/fragments/types/AvailableAttributeFragment";
import useElementScroll, {
  isScrolledToBottom
} from "@saleor/hooks/useElementScroll";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { maybe, renderCollection } from "@saleor/misc";
import { FetchMoreProps } from "@saleor/types";
import classNames from "classnames";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    actions: {
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
    },
    checkboxCell: {
      paddingLeft: 0
    },
    dropShadow: {
      boxShadow: `0px -5px 10px 0px ${theme.palette.divider}`
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      height: theme.spacing(3),
      justifyContent: "center"
    },
    scrollArea: {
      overflowY: "scroll"
    },
    wideCell: {
      width: "100%"
    }
  }),
  { name: "AssignAttributeDialog" }
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
  onToggle
}: AssignAttributeDialogProps) => {
  const intl = useIntl();
  const classes = useStyles({});
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const errors = useModalDialogErrors(apiErrors, open);
  const anchor = React.useRef(null);
  const position = useElementScroll(anchor);

  useModalDialogOpen(open, {
    onClose: resetQuery,
    onOpen
  });

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Assign Attribute"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage({
            defaultMessage: "Search Attributes"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Search by attribute name"
          })}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
          }}
        />
      </DialogContent>
      <DialogContent className={classes.scrollArea} ref={anchor}>
        <InfiniteScroll
          pageStart={0}
          loadMore={onFetchMore}
          hasMore={hasMore}
          useWindow={false}
          loader={
            <div className={classes.loadMoreLoaderContainer}>
              <CircularProgress size={16} />
            </div>
          }
          threshold={100}
          key="infinite-scroll"
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
                    selectedAttribute => selectedAttribute === attribute.id
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
                        <FormattedMessage defaultMessage="No results found" />
                      </TableCell>
                    </TableRow>
                  )
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
          [classes.dropShadow]: !isScrolledToBottom(anchor, position)
        })}
      >
        <Button onClick={onClose}>
          <FormattedMessage {...buttonMessages.back} />
        </Button>
        <ConfirmButton
          transitionState={confirmButtonState}
          color="primary"
          variant="contained"
          type="submit"
          onClick={onSubmit}
        >
          <FormattedMessage
            defaultMessage="Assign attributes"
            description="button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignAttributeDialog.displayName = "AssignAttributeDialog";
export default AssignAttributeDialog;
