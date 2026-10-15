import AssignContainerDialog, {
  type AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog/AssignContainerDialog";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

const EMPTY_SEARCH_FILTERS = {};

export interface AssignShippingZoneDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState?: ConfirmButtonTransitionState;
  /**
   * Zones returned by the current search. Pass zones that are already linked through
   * `excludeContainer` so a page of only those rows can load the next page.
   */
  shippingZones: Array<{ id: string; name: string }>;
  excludeContainer?: (container: Container) => boolean;
  loading: boolean;
  onFetch: (query: string) => void;
  /**
   * Return a promise to keep the dialog open, with its confirm button loading and dismissal
   * blocked, until it settles. A rejected promise leaves the dialog open with the selection
   * intact so the user can retry; the caller reports the error.
   */
  onSubmit: (shippingZones: Container[]) => void | Promise<unknown>;
}

export const AssignShippingZoneDialog = ({
  confirmButtonState = "default",
  shippingZones,
  excludeContainer,
  loading,
  onFetch,
  onSubmit,
  open,
  onClose,
  ...fetchMoreProps
}: AssignShippingZoneDialogProps): React.ReactNode => {
  const intl = useIntl();
  const [submitting, setSubmitting] = useState(false);

  const { query, onQueryChange, resetQuery } = useModalSearchWithFilters({
    filterVariables: EMPTY_SEARCH_FILTERS,
    open,
    onFetch: (_filters, searchQuery) => onFetch(searchQuery),
  });

  const containers: Container[] = shippingZones.map(zone => ({
    id: zone.id,
    name: zone.name,
  }));

  const labels: AssignContainerDialogProps["labels"] = {
    title: intl.formatMessage(messages.title),
    label: intl.formatMessage(messages.searchLabel),
    placeholder: intl.formatMessage(messages.searchPlaceholder),
    confirmBtn: intl.formatMessage(messages.confirm),
  };

  const emptyMessage = query
    ? intl.formatMessage(messages.noShippingZonesFound)
    : intl.formatMessage(messages.noShippingZonesAvailable);

  // While a submit runs, the dialog must stay as it was submitted: closing it would let the
  // user reopen it, and the old submit would then close the new session when it settles.
  const resetQueryUnlessSubmitting = (): void => {
    if (!submitting) {
      resetQuery();
    }
  };

  const handleClose = (): void => {
    if (submitting) {
      return;
    }

    resetQuery();
    onClose();
  };

  const handleSubmit = async (selected: Container[]): Promise<void> => {
    const pending = onSubmit(selected);

    if (pending) {
      setSubmitting(true);

      try {
        await pending;
      } catch {
        return;
      } finally {
        setSubmitting(false);
      }
    }

    resetQuery();
    onClose();
  };

  return (
    <AssignContainerDialog
      {...fetchMoreProps}
      confirmButtonState={submitting ? "loading" : confirmButtonState}
      containers={containers}
      excludeContainer={excludeContainer}
      backfillResetKey={query}
      emptyMessage={emptyMessage}
      labels={labels}
      loading={loading}
      open={open}
      onClose={handleClose}
      onFetch={() => {}}
      onSubmit={selected => void handleSubmit(selected)}
      search={{ query, onQueryChange, resetQuery: resetQueryUnlessSubmitting }}
      selectionMode="multiple"
    />
  );
};
