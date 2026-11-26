import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { AppManageTabs } from "./AppManageTabs";

type TabId = "details" | "deliveries";

const Interactive = () => {
  const [activeId, setActiveId] = useState<TabId>("details");

  return (
    <AppManageTabs<TabId>
      ariaLabel="Manage app sections"
      activeId={activeId}
      onChange={setActiveId}
      tabs={[
        { id: "details", label: "Details" },
        { id: "deliveries", label: "Webhook deliveries" },
      ]}
    />
  );
};

const meta: Meta<typeof Interactive> = {
  title: "Extensions/Manage app/Tabs",
  component: Interactive,
};

export default meta;
type Story = StoryObj<typeof Interactive>;

export const Default: Story = {};
