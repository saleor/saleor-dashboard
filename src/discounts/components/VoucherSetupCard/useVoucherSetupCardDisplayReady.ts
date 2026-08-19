import { useLayoutEffect, useRef, useState } from "react";

export interface VoucherSetupCardDisplayReadyInput {
  serverChannelCount: number;
  channelListingsCount: number;
  savedCodesCount: number;
  voucherCodesLoading: boolean;
}

export const isVoucherSetupCardDataSynced = ({
  serverChannelCount,
  channelListingsCount,
  savedCodesCount,
  voucherCodesLoading,
}: VoucherSetupCardDisplayReadyInput): boolean =>
  (serverChannelCount === 0 || channelListingsCount > 0) &&
  (savedCodesCount === 0 || !voucherCodesLoading);

interface UseVoucherSetupCardDisplayReadyInput extends VoucherSetupCardDisplayReadyInput {
  voucherId: string | undefined;
}

/**
 * Avoids a one-frame setup checklist flash while channel drafts and code
 * listings catch up with saved voucher data after navigation. Once synced,
 * stays ready so clearing channel drafts can still surface the checklist.
 */
export const useVoucherSetupCardDisplayReady = ({
  voucherId,
  ...syncInput
}: UseVoucherSetupCardDisplayReadyInput): boolean => {
  const trackedVoucherIdRef = useRef(voucherId);
  const [displayReady, setDisplayReady] = useState(() => isVoucherSetupCardDataSynced(syncInput));

  useLayoutEffect(
    function syncVoucherSetupCardDisplayReady() {
      const readyNow = isVoucherSetupCardDataSynced(syncInput);

      if (trackedVoucherIdRef.current !== voucherId) {
        trackedVoucherIdRef.current = voucherId;
        setDisplayReady(readyNow);

        return;
      }

      setDisplayReady(current => current || readyNow);
    },
    [
      voucherId,
      syncInput.serverChannelCount,
      syncInput.channelListingsCount,
      syncInput.savedCodesCount,
      syncInput.voucherCodesLoading,
    ],
  );

  return displayReady;
};
