import debounce from "lodash/debounce";
import { useEffect, useMemo, useRef } from "react";
import { Control, FieldValues, useFormState, UseFormWatch } from "react-hook-form";

interface UseAutoSubmitProps<TFieldValues extends FieldValues> {
  watch: UseFormWatch<TFieldValues>;
  control: Control<TFieldValues>;
  onSubmit: () => void; // Changed to match expected type
  debounceTime?: number;
  excludeFields?: Array<keyof TFieldValues>;
}

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

type ControlFunctions = {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
};

export type DebouncedState<T extends (...args: any) => ReturnType<T>> = ((
  ...args: Parameters<T>
) => ReturnType<T> | undefined) &
  ControlFunctions;

export function useDebounceCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  delay = 500,
  options?: DebounceOptions,
): DebouncedState<T> {
  const debouncedFunc = useRef<ReturnType<typeof debounce>>();

  const debounced = useMemo(() => {
    const debouncedFuncInstance = debounce(func, delay, options);

    const wrappedFunc: DebouncedState<T> = (...args: Parameters<T>) => {
      return debouncedFuncInstance(...args);
    };

    wrappedFunc.cancel = () => {
      debouncedFuncInstance.cancel();
    };

    wrappedFunc.isPending = () => {
      return !!debouncedFunc.current;
    };

    wrappedFunc.flush = () => {
      return debouncedFuncInstance.flush();
    };

    return wrappedFunc;

    // Using full dependencies array causes debounce function
    // to be recreated on every render (comparing options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [func]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (debouncedFunc.current) {
        debouncedFunc.current.cancel();
      }
    };
  }, []);

  useEffect(() => {
    debouncedFunc.current = debounced;
  }, [debounced]);

  return debounced;
}

export function useAutoSubmit<TFieldValues extends FieldValues>({
  watch,
  control,
  onSubmit,
  debounceTime = 1000,
}: UseAutoSubmitProps<TFieldValues>) {
  // Note: form will have `isSubmitted` state which changes validation to be done onChange (by default)
  // to change this behavior we would need to first validate form, then call onSubmit
  const debouncedSubmit = useDebounceCallback(onSubmit, debounceTime);

  // Call debounce after form was changed by user
  useEffect(() => {
    const subscription = watch((_, info) => {
      if (info?.type !== "change") return;

      debouncedSubmit();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch, debouncedSubmit]);

  // Cancel debounce if form is already submitting
  const { isSubmitting } = useFormState({ control });

  useEffect(() => {
    if (isSubmitting) {
      debouncedSubmit.cancel();
    }
  }, [debouncedSubmit, isSubmitting]);

  return debouncedSubmit;
}
