import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { type AvailableAttributeFragment } from "@dashboard/graphql";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQuery from "@dashboard/hooks/useSearchQuery";
import { renderCollection } from "@dashboard/misc";
import { type FetchMoreProps } from "@dashboard/types";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import { messages } from "./messages";

interface AssignAttributeDialogProps extends FetchMoreProps {
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
const AssignAttributeDialog = ({
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
  const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);
  const errors = useModalDialogErrors(apiErrors, open);

  useModalDialogOpen(open, {
    onClose: resetQuery,
    onOpen,
  });

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto auto" gap={3}>
        <DashboardModal.Header>
          <FormattedMessage {...messages.title} />
        </DashboardModal.Header>

        <Input
          data-test-id="attribute-search-input"
          name="query"
          value={query}
          onChange={onQueryChange}
          label={intl.formatMessage(messages.searchInputLabel)}
          placeholder={intl.formatMessage(messages.searchInputPlaceholder)}
          width="100%"
          endAdornment={loading ? <SaleorThrobber size={16} /> : undefined}
          autoComplete="off"
        />

        <InfiniteScroll
          id={scrollableTargetId}
          dataLength={attributes?.length || 0}
          next={onFetchMore}
          hasMore={hasMore}
          scrollThreshold="100px"
          scrollableTarget={scrollableTargetId}
        >
          <Box display="flex" flexDirection="column" data-test-id="attributes-list">
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
                  <Box
                    key={attribute.id}
                    display="flex"
                    alignItems="center"
                    gap={3}
                    cursor="pointer"
                    paddingX={3}
                    paddingY={2}
                    borderBottomWidth={1}
                    borderBottomStyle="solid"
                    borderColor="default1"
                    data-test-id="dialog-row"
                    onClick={() => onToggle(attribute.id)}
                  >
                    <Box __transform="scale(1.2)">
                      <Checkbox checked={isChecked} />
                    </Box>
                    <Box flexGrow="1">
                      <Text size={3}>{attribute.name}</Text>
                      <Text size={2} fontWeight="light" display="block">
                        {attribute.slug}
                      </Text>
                    </Box>
                  </Box>
                );
              },
              () =>
                !loading && (
                  <Box paddingX={3} paddingY={2}>
                    <FormattedMessage {...messages.noMembersFound} />
                  </Box>
                ),
            )}
          </Box>
        </InfiniteScroll>

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
