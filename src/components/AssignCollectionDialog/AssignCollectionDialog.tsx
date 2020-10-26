import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import useSearchQuery from "@saleor/hooks/useSearchQuery";
import { buttonMessages } from "@saleor/intl";
import { SearchCollections_search_edges_node } from "@saleor/searches/types/SearchCollections";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { FetchMoreProps } from "@saleor/types";
import React from "react";
import InfiniteScroll from "react-infinite-scroller";
import { FormattedMessage, useIntl } from "react-intl";

import Checkbox from "../Checkbox";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "../ConfirmButton/ConfirmButton";
import FormSpacer from "../FormSpacer";

export interface FormData {
  collections: SearchCollections_search_edges_node[];
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
  { name: "AssignCollectionDialog" }
);

interface AssignCollectionDialogProps extends FetchMoreProps {
  collections: SearchCollections_search_edges_node[];
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onFetch: (value: string) => void;
  onSubmit: (data: SearchCollections_search_edges_node[]) => void;
}

function handleCollectionAssign(
  product: SearchCollections_search_edges_node,
  isSelected: boolean,
  selectedCollections: SearchCollections_search_edges_node[],
  setSelectedCollections: (data: SearchCollections_search_edges_node[]) => void
) {
  if (isSelected) {
    setSelectedCollections(
      selectedCollections.filter(
        selectedProduct => selectedProduct.id !== product.id
      )
    );
  } else {
    setSelectedCollections([...selectedCollections, product]);
  }
}

const AssignCollectionDialog: React.FC<AssignCollectionDialogProps> = props => {
  const {
    confirmButtonState,
    hasMore,
    open,
    loading,
    collections,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit
  } = props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle({});

  const intl = useIntl();
  const [query, onQueryChange] = useSearchQuery(onFetch);
  const [selectedCollections, setSelectedCollections] = React.useState<
    SearchCollections_search_edges_node[]
  >([]);
  const container = React.useRef<HTMLDivElement>();

  const handleSubmit = () => onSubmit(selectedCollections);

  const containerHeight = container.current?.scrollHeight - 130;

  return (
    <Dialog
      onClose={onClose}
      open={open}
      classes={{ paper: scrollableDialogClasses.dialog }}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Assign Collection"
          description="dialog header"
        />
      </DialogTitle>
      <DialogContent className={scrollableDialogClasses.content}>
        <TextField
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage({
            defaultMessage: "Search Collection"
          })}
          placeholder={intl.formatMessage({
            defaultMessage: "Search by collection name, etc..."
          })}
          fullWidth
          InputProps={{
            autoComplete: "off",
            endAdornment: loading && <CircularProgress size={16} />
          }}
        />
        <FormSpacer />
        <div
          className={scrollableDialogClasses.scrollArea}
          style={{ height: containerHeight }}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={onFetchMore}
            hasMore={hasMore}
            useWindow={false}
            loader={
              <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
                <CircularProgress size={16} />
              </div>
            }
            threshold={10}
          >
            <ResponsiveTable>
              <TableBody>
                {collections &&
                  collections.map(collection => {
                    const isSelected = !!selectedCollections.find(
                      selectedCollection =>
                        selectedCollection.id === collection.id
                    );

                    return (
                      <TableRow key={collection.id}>
                        <TableCell
                          padding="checkbox"
                          className={classes.checkboxCell}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() =>
                              handleCollectionAssign(
                                collection,
                                isSelected,
                                selectedCollections,
                                setSelectedCollections
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className={classes.wideCell}>
                          {collection.name}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </ResponsiveTable>
          </InfiniteScroll>
        </div>
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
          <FormattedMessage
            defaultMessage="Assign collections"
            description="button"
          />
        </ConfirmButton>
      </DialogActions>
    </Dialog>
  );
};
AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
