import { getDefaultStore } from "jotai";
import { toast } from "sonner";

import {
  dismissVisibleToasts,
  enqueueToast,
  getToastDedupKey,
  handleToastDismissed,
  MAX_VISIBLE_TOASTS,
  notificationQueueStateAtom,
  resetNotificationQueueForTests,
} from "./notificationQueue";

jest.mock("sonner", () => ({
  toast: {
    custom: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const mockToastCustom = toast.custom as jest.Mock;
const mockToastDismiss = toast.dismiss as jest.Mock;
const store = getDefaultStore();

describe("notificationQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetNotificationQueueForTests();
  });

  it("mounts toasts until the visible cap is reached", () => {
    // Arrange & Act
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });

    // Assert
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(0);
  });

  it("queues transient overflow beyond the visible cap", () => {
    // Arrange & Act
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });
    enqueueToast({ type: "info", title: "Four", duration: 5000 });

    // Assert
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(1);
    expect(store.get(notificationQueueStateAtom).queue[0].input.title).toBe("Four");
  });

  it("queues errors FIFO when the visible cap is full (no preemption)", () => {
    // Arrange & Act
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });
    enqueueToast({ type: "error", title: "Four" });

    // Assert — urgency is stickiness once shown, not jumping the line
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS);
    expect(mockToastDismiss).not.toHaveBeenCalled();
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(1);
    expect(store.get(notificationQueueStateAtom).queue[0].input.title).toBe("Four");
  });

  it("promotes the next queued toast when a visible one is dismissed", () => {
    // Arrange
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });
    enqueueToast({ type: "error", title: "Four" });

    const firstActiveId = store.get(notificationQueueStateAtom).active[0].clientId;

    // Act
    handleToastDismissed(firstActiveId);

    // Assert
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS + 1);
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(0);

    const lastCall = mockToastCustom.mock.calls[MAX_VISIBLE_TOASTS];
    const renderFn = lastCall[0];

    expect(renderFn("id").props.title).toBe("Four");
  });

  it("replaces an active toast when type and title match", () => {
    // Arrange
    enqueueToast({
      type: "success",
      title: "Changes saved",
      description: "First",
      duration: 5000,
    });

    // Act
    enqueueToast({
      type: "success",
      title: "Changes saved",
      description: "Updated",
      duration: 5000,
    });

    // Assert
    expect(mockToastCustom).toHaveBeenCalledTimes(2);
    expect(mockToastDismiss).toHaveBeenCalledTimes(1);
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(1);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(0);

    const renderFn = mockToastCustom.mock.calls[1][0];

    expect(renderFn("id").props.description).toBe("Updated");
  });

  it("updates a queued toast instead of enqueueing a duplicate", () => {
    // Arrange
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });
    enqueueToast({ type: "info", title: "Four", duration: 5000 });

    // Act
    enqueueToast({
      type: "info",
      title: "Four",
      description: "Updated queued copy",
      duration: 5000,
    });

    // Assert
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(1);
    expect(store.get(notificationQueueStateAtom).queue[0].input.description).toBe(
      "Updated queued copy",
    );
  });

  it("does not dedupe toasts with different titles for the same type", () => {
    // Arrange & Act
    enqueueToast({ type: "success", title: "Saved product", duration: 5000 });
    enqueueToast({ type: "success", title: "Saved collection", duration: 5000 });

    // Assert
    expect(getToastDedupKey({ type: "success", title: "Saved product" })).not.toBe(
      getToastDedupKey({ type: "success", title: "Saved collection" }),
    );
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(2);
  });

  it("dismissVisibleToasts clears active toasts and promotes the queue", () => {
    // Arrange
    enqueueToast({ type: "success", title: "One", duration: 5000 });
    enqueueToast({ type: "info", title: "Two", duration: 5000 });
    enqueueToast({ type: "warning", title: "Three", duration: 5000 });
    enqueueToast({ type: "info", title: "Four", duration: 5000 });

    // Act
    dismissVisibleToasts();

    // Assert — only "Four" was queued, so one toast replaces the dismissed stack
    expect(mockToastDismiss).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS);
    expect(mockToastCustom).toHaveBeenCalledTimes(MAX_VISIBLE_TOASTS + 1);
    expect(store.get(notificationQueueStateAtom).active).toHaveLength(1);
    expect(store.get(notificationQueueStateAtom).queue).toHaveLength(0);
    expect(store.get(notificationQueueStateAtom).active[0].input.title).toBe("Four");
  });
});
