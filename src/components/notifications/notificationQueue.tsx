import { type ToastProps } from "@dashboard/components/notifications/Toast";
import { atom, getDefaultStore } from "jotai";
import { toast } from "sonner";

import { Toast } from "./Toast";

/** Max toasts shown at once; overflow waits until a slot frees (FIFO). */
export const MAX_VISIBLE_TOASTS = 3;

export type EnqueueToastInput = Omit<ToastProps, "id" | "onRemoved">;

type ActiveToast = {
  clientId: string;
  input: EnqueueToastInput;
  dedupKey: string;
};

type QueuedToast = {
  input: EnqueueToastInput;
  dedupKey: string;
};

type NotificationQueueState = {
  active: ActiveToast[];
  queue: QueuedToast[];
};

const initialState: NotificationQueueState = {
  active: [],
  queue: [],
};

export const notificationQueueStateAtom = atom<NotificationQueueState>(initialState);

const store = getDefaultStore();

/** Dismiss fired while replacing a duplicate — skip queue promotion. */
const replacingClientIds = new Set<string>();

/** Bulk “dismiss visible” in progress — skip per-toast promotion. */
let isDismissingVisibleBatch = false;

const createClientId = (): string =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Same type + title → one toast (replace in place or update the queued copy). */
export const getToastDedupKey = (input: EnqueueToastInput): string =>
  `${input.type}:${input.title}`;

const withoutQueuedKey = (queue: QueuedToast[], dedupKey: string): QueuedToast[] =>
  queue.filter(item => item.dedupKey !== dedupKey);

const mountToast = (clientId: string, input: EnqueueToastInput): void => {
  toast.custom(
    id => <Toast id={id} {...input} onRemoved={() => handleToastDismissed(clientId)} />,
    {
      id: clientId,
      duration: Infinity,
    },
  );
};

const replaceActiveToast = (
  state: NotificationQueueState,
  existing: ActiveToast,
  input: EnqueueToastInput,
  dedupKey: string,
): NotificationQueueState => {
  const clientId = createClientId();

  replacingClientIds.add(existing.clientId);
  toast.dismiss(existing.clientId);
  mountToast(clientId, input);

  return {
    active: state.active.map(item =>
      item.clientId === existing.clientId ? { clientId, input, dedupKey } : item,
    ),
    queue: withoutQueuedKey(state.queue, dedupKey),
  };
};

const promoteFromQueue = (state: NotificationQueueState): NotificationQueueState => {
  const nextActive = [...state.active];
  const nextQueue = [...state.queue];

  while (nextActive.length < MAX_VISIBLE_TOASTS && nextQueue.length > 0) {
    const next = nextQueue.shift();

    if (!next) {
      break;
    }

    // Fresh id — Sonner won't remount a toast that was previously dismissed.
    const clientId = createClientId();

    nextActive.push({ clientId, input: next.input, dedupKey: next.dedupKey });
    mountToast(clientId, next.input);
  }

  return {
    active: nextActive,
    queue: nextQueue,
  };
};

export const enqueueToast = (input: EnqueueToastInput): void => {
  const dedupKey = getToastDedupKey(input);
  const state = store.get(notificationQueueStateAtom);

  const activeDuplicate = state.active.find(item => item.dedupKey === dedupKey);

  if (activeDuplicate) {
    store.set(
      notificationQueueStateAtom,
      replaceActiveToast(state, activeDuplicate, input, dedupKey),
    );

    return;
  }

  const queuedDuplicateIndex = state.queue.findIndex(item => item.dedupKey === dedupKey);

  if (queuedDuplicateIndex >= 0) {
    const nextQueue = [...state.queue];

    nextQueue[queuedDuplicateIndex] = { input, dedupKey };
    store.set(notificationQueueStateAtom, { ...state, queue: nextQueue });

    return;
  }

  const clientId = createClientId();

  if (state.active.length < MAX_VISIBLE_TOASTS) {
    store.set(notificationQueueStateAtom, {
      ...state,
      active: [...state.active, { clientId, input, dedupKey }],
    });
    mountToast(clientId, input);

    return;
  }

  store.set(notificationQueueStateAtom, {
    ...state,
    queue: [...state.queue, { input, dedupKey }],
  });
};

export const handleToastDismissed = (clientId: string): void => {
  if (isDismissingVisibleBatch) {
    return;
  }

  if (replacingClientIds.has(clientId)) {
    replacingClientIds.delete(clientId);

    return;
  }

  const state = store.get(notificationQueueStateAtom);
  const wasActive = state.active.some(item => item.clientId === clientId);

  if (!wasActive) {
    return;
  }

  store.set(
    notificationQueueStateAtom,
    promoteFromQueue({
      ...state,
      active: state.active.filter(item => item.clientId !== clientId),
    }),
  );
};

/** Dismiss visible toasts only; queued toasts promote afterward. */
export const dismissVisibleToasts = (): void => {
  const state = store.get(notificationQueueStateAtom);

  if (state.active.length === 0) {
    return;
  }

  const activeToDismiss = [...state.active];

  isDismissingVisibleBatch = true;

  try {
    activeToDismiss.forEach(item => {
      toast.dismiss(item.clientId);
    });

    store.set(
      notificationQueueStateAtom,
      promoteFromQueue({
        active: [],
        queue: state.queue,
      }),
    );
  } finally {
    isDismissingVisibleBatch = false;
  }
};

/** Clear queue and dismiss everything currently on screen. */
export const dismissAllToasts = (): void => {
  const state = store.get(notificationQueueStateAtom);

  store.set(notificationQueueStateAtom, initialState);
  state.active.forEach(item => {
    toast.dismiss(item.clientId);
  });
  toast.dismiss();
};

/** Test helper — resets in-memory queue state without touching the DOM. */
export const resetNotificationQueueForTests = (): void => {
  replacingClientIds.clear();
  isDismissingVisibleBatch = false;
  store.set(notificationQueueStateAtom, initialState);
};
