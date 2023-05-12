import { Meta, Story } from "@storybook/react";
import React from "react";

import {
  ConfirmButton,
  ConfirmButtonLabels,
  ConfirmButtonTransitionState,
} from "./ConfirmButton";

const labels: ConfirmButtonLabels = {
  confirm: "Confirm",
  error: "Error",
};

export const Interactive: Story = () => {
  const [transitionState, setTransitionState] =
    React.useState<ConfirmButtonTransitionState>("default");
  const timer = React.useRef<number>();
  React.useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const setSuccess = () => {
    setTransitionState("success");
    timer.current = undefined;
  };

  const handleClick = () => {
    if (!timer.current) {
      setTransitionState("loading");
      timer.current = setTimeout(setSuccess, 2000) as unknown as number;
    }
  };

  return (
    <>
      <ConfirmButton
        labels={labels}
        transitionState={transitionState}
        onClick={handleClick}
      />
      <ConfirmButton
        labels={labels}
        transitionState={transitionState}
        onClick={handleClick}
        variant="secondary"
      />
    </>
  );
};

export const Default: Story = () => (
  <>
    <ConfirmButton labels={labels} transitionState="default" />
    <ConfirmButton
      labels={labels}
      transitionState="default"
      variant="secondary"
    />
  </>
);
export const Loading: Story = () => (
  <>
    <ConfirmButton
      labels={labels}
      transitionState="loading"
      noTransition={true}
    />
    <ConfirmButton
      labels={labels}
      transitionState="loading"
      noTransition={true}
      variant="secondary"
    />
  </>
);
export const Error: Story = () => (
  <>
    <ConfirmButton
      labels={labels}
      transitionState="error"
      noTransition={true}
    />
    <ConfirmButton
      labels={labels}
      transitionState="error"
      noTransition={true}
      variant="secondary"
    />
  </>
);
export const Success: Story = () => (
  <>
    <ConfirmButton
      labels={labels}
      transitionState="success"
      noTransition={true}
    />
    <ConfirmButton
      labels={labels}
      transitionState="success"
      noTransition={true}
      variant="secondary"
    />
  </>
);

export default {
  decorators: [
    Story => (
      <div style={{ display: "flex", gap: "24px" }}>
        <Story />
      </div>
    ),
  ],
  title: "Confirm Button",
} as Meta;
