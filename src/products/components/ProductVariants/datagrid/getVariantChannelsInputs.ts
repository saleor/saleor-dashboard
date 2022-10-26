import {
  DatagridChange,
  DatagridChangeOpts,
} from "@saleor/components/Datagrid/useDatagridChange";

import { getColumnChannel, getColumnChannelAvailability } from "./columnData";

const byCurrentRowByIndex = (index: number, data: DatagridChangeOpts) => (
  change: DatagridChange,
) => {
  const totalRemoved = data.removed.filter(r => r <= index).length;
  return change.row === index + totalRemoved;
};

const byChannelColumn = (change: DatagridChange) =>
  getColumnChannel(change.column);

const availabilityToChannelColumn = (change: DatagridChange) => {
  const availabilityChannelId = getColumnChannelAvailability(change.column);

  if (availabilityChannelId) {
    return {
      data: {
        value: change.data ? 0 : null,
      },
      column: `channel:${availabilityChannelId}`,
    };
  }
  return change;
};

const byColumn = (prev: DatagridChange[], change: DatagridChange) => {
  const index = prev.findIndex(p => p.column === change.column);
  if (index > -1) {
    prev[index] = change;
    return prev;
  }

  return prev.concat(change);
};

const dataGridChangeToFlatChannel = (change: DatagridChange) => ({
  channelId: getColumnChannel(change.column),
  price: change.data.value,
});

const byNotNullPrice = (
  change: ReturnType<typeof dataGridChangeToFlatChannel>,
) => change.price !== null;

export function getVariantChannelsInputs(
  data: DatagridChangeOpts,
  index: number,
) {
  return data.updates
    .filter(byCurrentRowByIndex(index, data))
    .map(availabilityToChannelColumn)
    .filter(byChannelColumn)
    .reduce(byColumn, [])
    .map(dataGridChangeToFlatChannel)
    .filter(byNotNullPrice);
}
