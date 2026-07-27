import {
  useCreateManualTransactionCaptureMutation,
  useInvoiceRequestMutation,
  useOrderCancelMutation,
  useOrderCaptureMutation,
  useOrderDraftCancelMutation,
  useOrderDraftFinalizeMutation,
  useOrderDraftUpdateMutation,
  useOrderFulfillmentApproveMutation,
  useOrderMarkAsPaidMutation,
  useOrderNoteAddMutation,
  useOrderTransactionRequestActionMutation,
  useOrderUpdateMutation,
  useOrderVoidMutation,
} from "@dashboard/graphql";
import { renderHook } from "@testing-library/react";

import { type OrderOperationHandlers } from "./handlers";
import { useCommonOrderOperations } from "./useCommonOrderOperations";
import { useDraftOrderOperations } from "./useDraftOrderOperations";
import { useLegacyOrderOperations } from "./useLegacyOrderOperations";
import { useTransactionOrderOperations } from "./useTransactionOrderOperations";

// Mock every generated mutation hook to an inert [mutate, opts] tuple so we can
// assert which ones each operation hook instantiates without touching Apollo.
jest.mock("@dashboard/graphql", () => {
  const actual = jest.requireActual("@dashboard/graphql");
  const tuple = () => [jest.fn(), { status: "default" }];
  const hookNames = [
    "useCreateManualTransactionCaptureMutation",
    "useInvoiceEmailSendMutation",
    "useInvoiceRequestMutation",
    "useOrderCancelMutation",
    "useOrderCaptureMutation",
    "useOrderDraftCancelMutation",
    "useOrderDraftFinalizeMutation",
    "useOrderDraftUpdateMutation",
    "useOrderFulfillmentApproveMutation",
    "useOrderFulfillmentCancelMutation",
    "useOrderFulfillmentUpdateTrackingMutation",
    "useOrderLineDeleteMutation",
    "useOrderLinesAddMutation",
    "useOrderLineUpdateMutation",
    "useOrderMarkAsPaidMutation",
    "useOrderNoteAddMutation",
    "useOrderNoteUpdateMutation",
    "useOrderShippingMethodUpdateMutation",
    "useOrderTransactionRequestActionMutation",
    "useOrderUpdateMutation",
    "useOrderVoidMutation",
  ];
  const mocked = Object.fromEntries(hookNames.map(name => [name, jest.fn(tuple)]));

  return { ...actual, ...mocked };
});

const handlers = new Proxy({} as OrderOperationHandlers, { get: () => jest.fn() });

const legacyHooks = [useOrderCaptureMutation, useOrderVoidMutation];
const transactionHooks = [
  useOrderTransactionRequestActionMutation,
  useCreateManualTransactionCaptureMutation,
];

beforeEach(() => {
  jest.clearAllMocks();
});

describe("order operation ownership", () => {
  it("common ops instantiate shared mutations but neither payment mode's", () => {
    // Act
    renderHook(() => useCommonOrderOperations(handlers));

    // Assert - shared mutations are created
    expect(useOrderNoteAddMutation).toHaveBeenCalled();
    expect(useOrderUpdateMutation).toHaveBeenCalled();
    expect(useOrderFulfillmentApproveMutation).toHaveBeenCalled();
    expect(useInvoiceRequestMutation).toHaveBeenCalled();
    // Assert - no legacy, transaction, mark-as-paid or draft mutations
    [...legacyHooks, ...transactionHooks, useOrderMarkAsPaidMutation].forEach(hook =>
      expect(hook).not.toHaveBeenCalled(),
    );
    expect(useOrderDraftUpdateMutation).not.toHaveBeenCalled();
  });

  it("legacy ops instantiate capture/void/mark-as-paid and no transaction hooks", () => {
    // Act
    renderHook(() => useLegacyOrderOperations(handlers));

    // Assert
    expect(useOrderCaptureMutation).toHaveBeenCalled();
    expect(useOrderVoidMutation).toHaveBeenCalled();
    expect(useOrderMarkAsPaidMutation).toHaveBeenCalled();
    transactionHooks.forEach(hook => expect(hook).not.toHaveBeenCalled());
  });

  it("transaction ops instantiate transaction/mark-as-paid and no legacy hooks", () => {
    // Act
    renderHook(() => useTransactionOrderOperations(handlers));

    // Assert
    expect(useOrderTransactionRequestActionMutation).toHaveBeenCalled();
    expect(useCreateManualTransactionCaptureMutation).toHaveBeenCalled();
    expect(useOrderMarkAsPaidMutation).toHaveBeenCalled();
    legacyHooks.forEach(hook => expect(hook).not.toHaveBeenCalled());
  });

  it("draft ops instantiate draft mutations and no payment, transaction or fulfillment hooks", () => {
    // Act
    renderHook(() => useDraftOrderOperations(handlers));

    // Assert
    expect(useOrderDraftUpdateMutation).toHaveBeenCalled();
    expect(useOrderDraftFinalizeMutation).toHaveBeenCalled();
    expect(useOrderDraftCancelMutation).toHaveBeenCalled();
    [
      ...legacyHooks,
      ...transactionHooks,
      useOrderMarkAsPaidMutation,
      useOrderFulfillmentApproveMutation,
      useInvoiceRequestMutation,
      useOrderCancelMutation,
    ].forEach(hook => expect(hook).not.toHaveBeenCalled());
  });
});
