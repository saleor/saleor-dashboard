import React, { useCallback } from "react";

interface UseAutomaticCompletionHandlersParams {
  savedCutOffDate: string;
  savedCutOffTime: string;
  onCheckboxChange: () => void;
  onCutOffDateChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCutOffTimeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseAutomaticCompletionHandlersResult {
  handleMainCheckboxChange: () => void;
  handleSetCurrentDateTime: () => void;
  handleResetToSaved: () => void;
}

export const useAutomaticCompletionHandlers = ({
  savedCutOffDate,
  savedCutOffTime,
  onCheckboxChange,
  onCutOffDateChange,
  onCutOffTimeChange,
}: UseAutomaticCompletionHandlersParams): UseAutomaticCompletionHandlersResult => {
  const handleMainCheckboxChange = useCallback((): void => {
    onCheckboxChange();
  }, [onCheckboxChange]);

  const handleSetCurrentDateTime = useCallback((): void => {
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().slice(0, 5);

    onCutOffDateChange({
      target: { name: "automaticCompletionCutOffDate", value: date },
    } as React.ChangeEvent<HTMLInputElement>);
    onCutOffTimeChange({
      target: { name: "automaticCompletionCutOffTime", value: time },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [onCutOffDateChange, onCutOffTimeChange]);

  const handleResetToSaved = useCallback((): void => {
    onCutOffDateChange({
      target: { name: "automaticCompletionCutOffDate", value: savedCutOffDate },
    } as React.ChangeEvent<HTMLInputElement>);
    onCutOffTimeChange({
      target: { name: "automaticCompletionCutOffTime", value: savedCutOffTime },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [savedCutOffDate, savedCutOffTime, onCutOffDateChange, onCutOffTimeChange]);

  return {
    handleMainCheckboxChange,
    handleSetCurrentDateTime,
    handleResetToSaved,
  };
};
