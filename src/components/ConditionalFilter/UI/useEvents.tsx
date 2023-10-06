import { useEffect } from "react";

import { FilterEventEmitter } from "./EventEmitter";
import { FilterEvent } from "./types";

interface UseEventsProps {
  onChange?: (event: FilterEvent["detail"]) => void;
}

const emitter = new FilterEventEmitter();

export const useEventEmitter = ({ onChange }: UseEventsProps) => {
  useEffect(() => {
    const handleChange = (event: FilterEvent) => {
      onChange?.(event.detail);
    };

    emitter.addEventListener(emitter.type, handleChange);

    return () => {
      emitter.removeEventListener(emitter.type, handleChange);
    };
  }, [onChange]);

  return {
    emitter,
  };
};
