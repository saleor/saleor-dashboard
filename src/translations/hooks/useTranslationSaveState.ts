import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { getMutationState, maybe } from "@dashboard/misc";

export interface TranslationMutationOpts {
  called: boolean;
  loading: boolean;
  status: ConfirmButtonTransitionState;
  data?: Record<string, unknown> | null;
}

const getMutationErrorsFromData = (data: Record<string, unknown> | null | undefined): unknown[] => {
  if (!data) {
    return [];
  }

  const mutationResult = Object.values(data)[0];

  if (
    mutationResult &&
    typeof mutationResult === "object" &&
    "errors" in mutationResult &&
    Array.isArray(mutationResult.errors)
  ) {
    return mutationResult.errors;
  }

  return [];
};

export function useTranslationSaveState(
  queryLoading: boolean,
  ...mutationOpts: TranslationMutationOpts[]
): { disabled: boolean; saveButtonState: ConfirmButtonTransitionState } {
  const mutationLoading = mutationOpts.some(opts => opts.loading);
  const disabled = queryLoading || mutationLoading;

  if (mutationOpts.length === 0) {
    return {
      disabled: queryLoading,
      saveButtonState: "default",
    };
  }

  if (mutationOpts.length === 1) {
    const [opts] = mutationOpts;

    return {
      disabled,
      saveButtonState: mutationLoading ? "loading" : opts.status,
    };
  }

  const called = mutationOpts.some(opts => opts.called);
  const errorLists = mutationOpts.map(opts =>
    getMutationErrorsFromData(maybe(() => opts.data ?? undefined, undefined)),
  );

  return {
    disabled,
    saveButtonState: getMutationState(called, mutationLoading, ...errorLists),
  };
}
