import AssignContainerDialog, {
  type AssignContainerDialogProps,
} from "@dashboard/components/AssignContainerDialog/AssignContainerDialog";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { useModalSearchWithFilters } from "@dashboard/hooks/useModalSearchWithFilters";
import { type Container, type DialogProps, type FetchMoreProps } from "@dashboard/types";
import { useIntl } from "react-intl";

import { messages } from "./messages";

const EMPTY_SEARCH_FILTERS = {};

export interface AssignShippingZoneDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState?: ConfirmButtonTransitionState;
  /** Zones available to assign — already filtered by the parent (e.g. exclude assigned). */
  shippingZones: Array<{ id: string; name: string }>;
  loading: boolean;
  onFetch: (query: string) => void;
  onSubmit: (shippingZones: Container[]) => void;
}

export const AssignShippingZoneDialog = ({
  confirmButtonState = "default",
  shippingZones,
  loading,
  onFetch,
  onSubmit,
  open,
  onClose,
  ...fetchMoreProps
}: AssignShippingZoneDialogProps): JSX.Element => {
  const intl = useIntl();

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

  const handleClose = (): void => {
    resetQuery();
    onClose();
  };

  const handleSubmit = (selected: Container[]): void => {
    onSubmit(selected);
    resetQuery();
    onClose();
  };

  return (
    <AssignContainerDialog
      {...fetchMoreProps}
      confirmButtonState={confirmButtonState}
      containers={containers}
      emptyMessage={emptyMessage}
      labels={labels}
      loading={loading}
      open={open}
      onClose={handleClose}
      onFetch={() => {}}
      onSubmit={handleSubmit}
      search={{ query, onQueryChange, resetQuery }}
      selectionMode="multiple"
    />
  );
};
