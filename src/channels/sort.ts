import { ChannelsListUrlSortField } from "@dashboard/channels/urls";
import { type ChannelDetailsFragment } from "@dashboard/graphql";

export const sortChannels =
  (sort: ChannelsListUrlSortField | string | undefined, asc: boolean) =>
  (a: ChannelDetailsFragment, b: ChannelDetailsFragment): number => {
    if (sort === ChannelsListUrlSortField.status) {
      const cmp = Number(a.isActive) - Number(b.isActive);

      if (cmp !== 0) {
        return asc ? cmp : -cmp;
      }

      // Stable secondary key when status ties.
      return a.name.localeCompare(b.name);
    }

    const valueA = a.name;
    const valueB = b.name;

    return asc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  };
