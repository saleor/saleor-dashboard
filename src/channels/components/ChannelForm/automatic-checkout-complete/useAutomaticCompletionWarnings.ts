import { useMemo } from "react";
import { IntlShape } from "react-intl";

import { formatDateTime, formatTimeDifference } from "./utils";

export interface CutOffDateComparison {
  isEarlier: boolean;
  isLater: boolean;
  timeDifference: string;
  previousDate: string;
  newDate: string;
}

export interface UseAutomaticCompletionWarningsParams {
  isChecked: boolean;
  delay: number | string | null;
  cutOffDate: string;
  cutOffTime: string;
  savedIsEnabled: boolean;
  savedCutOffDate: string;
  savedCutOffTime: string;
  intl: IntlShape;
}

interface UseAutomaticCompletionWarningsResult {
  showDisabledInfo: boolean;
  showZeroDelayWarning: boolean;
  showCutOffDateEarlierWarning: boolean;
  showCutOffDateLaterInfo: boolean;
  cutOffDateComparison: CutOffDateComparison;
}

export const useAutomaticCompletionWarnings = ({
  isChecked,
  delay,
  cutOffDate,
  cutOffTime,
  savedIsEnabled,
  savedCutOffDate,
  savedCutOffTime,
  intl,
}: UseAutomaticCompletionWarningsParams): UseAutomaticCompletionWarningsResult => {
  // Check if form has changes from saved state (to avoid showing warnings on initial load)
  const hasEnabledChanged = isChecked !== savedIsEnabled;

  // Show info when user disables automatic completion that was previously enabled
  const showDisabledInfo = !isChecked && savedIsEnabled && hasEnabledChanged;

  // Show warning when user sets delay to 0 (immediate completion)
  const showZeroDelayWarning = isChecked && (delay === 0 || delay === "0");

  // Calculate date comparison data for warnings
  const cutOffDateComparison = useMemo((): CutOffDateComparison => {
    if (!isChecked || !cutOffDate || !savedCutOffDate) {
      return {
        isEarlier: false,
        isLater: false,
        timeDifference: "",
        previousDate: "",
        newDate: "",
      };
    }

    const savedDate = new Date(`${savedCutOffDate}T${savedCutOffTime || "00:00"}`);
    const newDate = new Date(`${cutOffDate}T${cutOffTime || "00:00"}`);
    const diffMs = newDate.getTime() - savedDate.getTime();

    return {
      isEarlier: diffMs < 0,
      isLater: diffMs > 0,
      timeDifference: formatTimeDifference(diffMs, intl),
      previousDate: formatDateTime(savedCutOffDate, savedCutOffTime, intl),
      newDate: formatDateTime(cutOffDate, cutOffTime, intl),
    };
  }, [isChecked, cutOffDate, cutOffTime, savedCutOffDate, savedCutOffTime, intl]);

  return {
    showDisabledInfo,
    showZeroDelayWarning,
    showCutOffDateEarlierWarning: cutOffDateComparison.isEarlier,
    showCutOffDateLaterInfo: cutOffDateComparison.isLater,
    cutOffDateComparison,
  };
};
