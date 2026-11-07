import { Box, Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import { type ConnectionCheckResult, createConnectionMonitor } from "../../connectionMonitor";
import { ConnectionStatusBanner } from "./ConnectionStatusBanner";

const unanswered: ConnectionCheckResult = {
  ok: false,
  failure: { httpStatus: 503, retryAfterMs: null },
};

/** The banner with a pretend Saleor that can be taken down and brought back. */
const SimulatedOutage = (): React.ReactNode => {
  const saleorAnswers = useRef(true);
  const [monitor] = useState(() =>
    createConnectionMonitor({
      check: async (): Promise<ConnectionCheckResult> =>
        saleorAnswers.current ? { ok: true } : unanswered,
      isBrowserOnline: () => true,
      isPageVisible: () => true,
      now: () => Date.now(),
      random: () => Math.random(),
      timers: {
        set: (callback, ms) => window.setTimeout(callback, ms),
        clear: handle => window.clearTimeout(handle),
      },
      reportError: () => undefined,
    }),
  );

  return (
    <>
      <ConnectionStatusBanner monitor={monitor} />
      <Box display="flex" gap={2} padding={4}>
        <Button
          variant="secondary"
          onClick={() => {
            saleorAnswers.current = false;
            monitor.reportFailure(unanswered.failure);
          }}
        >
          Take Saleor down
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            saleorAnswers.current = true;
          }}
        >
          Bring Saleor back
        </Button>
      </Box>
    </>
  );
};

const meta: Meta<typeof SimulatedOutage> = {
  title: "Connection / ConnectionStatusBanner",
  component: SimulatedOutage,
};

export default meta;
type Story = StoryObj<typeof SimulatedOutage>;

export const Outage: Story = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Take Saleor down" }));
    await expect(
      await canvas.findByText("Can't reach Saleor.", {}, { timeout: 3000 }),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Bring Saleor back" }));
    await userEvent.click(canvas.getByRole("button", { name: "Try now" }));
    await expect(
      await canvas.findByText("Connected again.", {}, { timeout: 3000 }),
    ).toBeInTheDocument();
  },
};
