import pulsePoster from "@assets/images/cover-big-pulse-by-saleor.png";
import { type Ripple } from "@dashboard/ripples/types";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";

import { RippleVideoAnnouncement } from "./RippleVideoAnnouncement";

const model: Ripple = {
  type: "feature",
  ID: "story-video-announcement",
  TTL_seconds: 999999,
  dateAdded: new Date(2026, 6, 31),
  content: {
    oneLiner: "Saleor Pulse",
    contextual: "See real-time store analytics on your homepage.",
    global: "Global description.",
  },
};

const RIPPLE_STORAGE_KEY = "dashboard-ripples";

const meta: Meta<typeof RippleVideoAnnouncement> = {
  title: "Ripples / RippleVideoAnnouncement",
  component: RippleVideoAnnouncement,
  parameters: {
    layout: "fullscreen",
  },
  beforeEach: () => {
    localStorage.removeItem(RIPPLE_STORAGE_KEY);
  },
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <MemoryRouter>
        <div
          style={{
            height: "100vh",
            background: "var(--mu-colors-background-default2)",
          }}
        >
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RippleVideoAnnouncement>;

export const Default: Story = {
  args: {
    model,
    videoUrl: "https://saleor.io/blog/20260716_pulse/pulse.mp4",
    posterUrl: pulsePoster,
    dismissAriaLabel: "Dismiss Pulse announcement",
    primaryAction: {
      href: "/home",
      label: "Explore Pulse",
    },
    secondaryAction: {
      href: "https://docs.saleor.io/developer/app-store/apps/pulse/overview",
      external: true,
      label: "See docs",
    },
  },
};
