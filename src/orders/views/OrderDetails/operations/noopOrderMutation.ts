import { type PartialMutationProviderOutput } from "@dashboard/types";

/**
 * Temporary bridge (T7): an inert mutation output for the payment mode a
 * concrete view does NOT own. The shared Normal/Unconfirmed views still read
 * `.opts.status`/`.opts.data` for both legacy and transaction dialogs even when
 * closed, so the unused mode must be a valid-but-inert object rather than
 * undefined. The unused mode's dialogs never open for that order, so `.mutate`
 * is never called. Removed in T10 once those views are split and payment-neutral.
 *
 * Typed as `any` so it is assignable to whichever specific mutation prop the
 * unowned mode expects.
 */
export const noopOrderMutation = (): PartialMutationProviderOutput<any, any> =>
  ({
    mutate: () => Promise.resolve({ data: undefined }),
    opts: {
      status: "default",
      called: false,
      loading: false,
      data: undefined,
      error: undefined,
      reset: () => undefined,
      client: undefined,
    },
  }) as unknown as PartialMutationProviderOutput<any, any>;
