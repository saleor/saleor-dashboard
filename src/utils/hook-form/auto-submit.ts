import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues, UseFormTrigger, UseFormWatch } from "react-hook-form";

interface UseAutoSubmitProps<TFieldValues extends FieldValues> {
  trigger: UseFormTrigger<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  onSubmit: () => void; // Changed to match expected type
  debounceTime?: number;
  excludeFields?: Array<keyof TFieldValues>;
}

function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  // Use ref to store the timeout ID between renders
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up the timeout when the component unmounts or when dependencies change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Create the debounced function
  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set a new timeout
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );

  return debouncedFunction;
}

export function useAutoSubmit<TFieldValues extends FieldValues>({
  trigger,
  watch,
  onSubmit,
  debounceTime = 500,
}: UseAutoSubmitProps<TFieldValues>) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const debouncedSubmit = useDebounce(onSubmit, debounceTime);

  useEffect(() => {
    const subscription = watch((_, info) => {
      if (info?.type !== "change") return;

      setIsSubmitting(true);
      trigger()
        .then(valid => {
          if (valid) {
            debouncedSubmit();
          }
        })
        .finally(() => setIsSubmitting(false));
    });

    return () => subscription.unsubscribe();
  }, [watch, onSubmit, trigger, debouncedSubmit]);

  return { isSubmitting };
}
