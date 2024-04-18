import { useUser } from "@dashboard/auth";
import { ChannelWarehouses } from "@dashboard/channels/pages/ChannelDetailsPage/types";
import { ChannelCreateInput } from "@dashboard/graphql";

import { useSaveChannel } from "./useSaveChannel";

jest.mock(
  "@dashboard/auth",
  jest.fn(() => ({
    useUser: jest.fn(),
  })),
);
describe("ChannelCreate", () => {
  test("Create channel with user reloading", async () => {
    const config = {
      createChannel: jest.fn(() => ({
        data: {
          channelCreate: {
            channel: {
              warehouses: [],
            },
          },
        },
      })),
      reorderChannelWarehouses: jest.fn(),
    } as unknown as Parameters<typeof useSaveChannel>[number];
    (useUser as jest.Mock).mockReturnValue({ refetchUser: jest.fn() });
    const input = {} as ChannelCreateInput;
    const warehousesToDisplay = [] as ChannelWarehouses;
    const save = useSaveChannel(config);

    await save(input, warehousesToDisplay);
    expect(useUser().refetchUser).toHaveBeenCalled();
  });
});
