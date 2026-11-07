import { type ConnectionMonitorDeps } from "./connectionMonitor";

const settle = async (): Promise<void> => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};

interface TestClock {
  now: () => number;
  timers: ConnectionMonitorDeps<number>["timers"];
  /** Moves time forward, running each timer that comes due and the promises it starts. */
  advance: (ms: number) => Promise<void>;
  settle: () => Promise<void>;
}

/** A clock for connection monitor tests: time only moves when the test moves it. */
export function createTestClock(): TestClock {
  let now = 0;
  let nextId = 0;
  const tasks = new Map<number, { at: number; callback: () => void }>();

  const advance = async (ms: number): Promise<void> => {
    const end = now + ms;

    for (;;) {
      const [due] = [...tasks.entries()]
        .filter(([, task]) => task.at <= end)
        .sort(([, a], [, b]) => a.at - b.at);

      if (!due) {
        break;
      }

      const [id, task] = due;

      tasks.delete(id);
      now = task.at;
      task.callback();
      await settle();
    }

    now = end;
    await settle();
  };

  return {
    now: () => now,
    timers: {
      set: (callback, ms) => {
        nextId += 1;
        tasks.set(nextId, { at: now + ms, callback });

        return nextId;
      },
      clear: handle => {
        tasks.delete(handle);
      },
    },
    advance,
    settle,
  };
}
