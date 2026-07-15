import { useEffect, useRef } from "react";

import { FilterEventEmitter } from "./EventEmitter";
import { type FilterEvent } from "./types";

interface UseEventsProps {
  onChange?: (event: FilterEvent["detail"]) => void;
}

export const useEventEmitter = ({ onChange }: UseEventsProps) => {
  const emitterRef = useRef<FilterEventEmitter>();

  if (!emitterRef.current) {
    emitterRef.current = new FilterEventEmitter();
  }

  const emitter = emitterRef.current;

  useEffect(() => {
    const handleChange = (event: FilterEvent) => {
      onChange?.(event.detail);
    };

    emitter.addEventListener(emitter.type, handleChange);

    return () => {
      emitter.removeEventListener(emitter.type, handleChange);
    };
  }, [emitter, onChange]);

  return {
    emitter,
  };
};
