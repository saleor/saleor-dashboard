import { renderHook } from "@testing-library/react";

import {
  isVoucherSetupCardDataSynced,
  useVoucherSetupCardDisplayReady,
} from "./useVoucherSetupCardDisplayReady";

describe("isVoucherSetupCardDataSynced", () => {
  it("is synced when the voucher has no saved channels or codes", () => {
    // Arrange & Act
    const synced = isVoucherSetupCardDataSynced({
      serverChannelCount: 0,
      channelListingsCount: 0,
      savedCodesCount: 0,
      voucherCodesLoading: false,
    });

    // Assert
    expect(synced).toBe(true);
  });

  it("waits for channel drafts to sync", () => {
    // Arrange & Act
    const synced = isVoucherSetupCardDataSynced({
      serverChannelCount: 2,
      channelListingsCount: 0,
      savedCodesCount: 1,
      voucherCodesLoading: false,
    });

    // Assert
    expect(synced).toBe(false);
  });

  it("waits for voucher codes to finish loading", () => {
    // Arrange & Act
    const synced = isVoucherSetupCardDataSynced({
      serverChannelCount: 0,
      channelListingsCount: 0,
      savedCodesCount: 3,
      voucherCodesLoading: true,
    });

    // Assert
    expect(synced).toBe(false);
  });
});

describe("useVoucherSetupCardDisplayReady", () => {
  it("waits for channel drafts to sync before becoming ready", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ channelListingsCount }) =>
        useVoucherSetupCardDisplayReady({
          voucherId: "voucher-1",
          serverChannelCount: 2,
          channelListingsCount,
          savedCodesCount: 1,
          voucherCodesLoading: false,
        }),
      { initialProps: { channelListingsCount: 0 } },
    );

    // Assert
    expect(result.current).toBe(false);

    // Act
    rerender({ channelListingsCount: 2 });

    // Assert
    expect(result.current).toBe(true);
  });

  it("resets readiness when navigating to another voucher", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ voucherId, channelListingsCount }) =>
        useVoucherSetupCardDisplayReady({
          voucherId,
          serverChannelCount: 2,
          channelListingsCount,
          savedCodesCount: 1,
          voucherCodesLoading: false,
        }),
      { initialProps: { voucherId: "voucher-1", channelListingsCount: 2 } },
    );

    expect(result.current).toBe(true);

    // Act
    rerender({ voucherId: "voucher-2", channelListingsCount: 0 });

    // Assert
    expect(result.current).toBe(false);
  });

  it("stays ready after channel drafts were synced once", () => {
    // Arrange
    const { result, rerender } = renderHook(
      ({ channelListingsCount }) =>
        useVoucherSetupCardDisplayReady({
          voucherId: "voucher-1",
          serverChannelCount: 2,
          channelListingsCount,
          savedCodesCount: 1,
          voucherCodesLoading: false,
        }),
      { initialProps: { channelListingsCount: 0 } },
    );

    rerender({ channelListingsCount: 2 });
    expect(result.current).toBe(true);

    // Act
    rerender({ channelListingsCount: 0 });

    // Assert
    expect(result.current).toBe(true);
  });
});
