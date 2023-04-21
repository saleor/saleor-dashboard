export * from "./hooks.generated";
export * from "./types.generated";
export * from "./typePolicies.generated";
export { default as introspectionQueryResultData } from "./fragmentTypes.generated";

// Rename OrderDetailsWithTransactions -> OrderDetails
// TODO: Remove this file

export type {
  OrderDetailsWithTransactionsQueryResult as OrderDetailsQueryResult,
  OrderDetailsWithTransactionsQueryHookResult as OrderDetailsQueryHookResult,
  OrderDetailsWithTransactionsLazyQueryHookResult as OrderDetailsLazyQueryHookResult,
} from "./hooks.generated";

export {
  OrderDetailsWithTransactionsFragmentDoc as OrderDetailsFragmentDoc,
  OrderDetailsWithTransactionsDocument as OrderDetailsDocument,
  useOrderDetailsWithTransactionsQuery as useOrderDetailsQuery,
  useOrderDetailsWithTransactionsLazyQuery as useOrderDetailsLazyQuery,
} from "./hooks.generated";

export type {
  OrderDetailsWithTransactionsFragment as OrderDetailsFragment,
  OrderDetailsWithTransactionsQueryVariables as OrderDetailsQueryVariables,
  OrderDetailsWithTransactionsQuery as OrderDetailsQuery,
} from "./types.generated";
