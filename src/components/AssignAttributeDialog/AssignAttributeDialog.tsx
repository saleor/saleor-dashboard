// @ts-strict-ignore
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { AvailableAttributeFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { maybe, renderCollection } from "@dashboard/misc";
import { FetchMoreProps } from "@dashboard/types";
import { CircularProgress, TableBody, TableCell, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    checkboxCell: {
      paddingLeft: 0,
    },
    loadMoreLoaderContainer: {
      alignItems: "center",
      display: "flex",
      marginTop: theme.spacing(2),
      height: theme.spacing(3),
      justifyContent: "center",
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

  useModalDialogOpen(open, {
    onClose: resetQuery,
    onOpen,
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto auto">
        <DashboardModal.Header>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

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

        <Box id={scrollableTargetId} ref={anchor} overflowY="auto">
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
                          <Text size={2} fontWeight="light" display="block">
                            {attribute.slug}
                          </Text>
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
        </Box>

        <Box>
          {errors.length > 0 &&
            errors.map((error, errorIndex) => (
              <Text display="block" color="critical1" key={errorIndex}>
                {error}
              </Text>
            ))}
        </Box>

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            type="submit"
            onClick={onSubmit}
            data-test-id="assign-and-save-button"
          >
            <FormattedMessage {...messages.assignButton} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignAttributeDialog.displayName = "AssignAttributeDialog";
export default AssignAttributeDialog;
