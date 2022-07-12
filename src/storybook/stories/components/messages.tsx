import { Button } from "@saleor/components/Button";
import { IMessage } from "@saleor/components/messages";
import useNotifier from "@saleor/hooks/useNotifier";
import { storiesOf } from "@storybook/react";
import React from "react";

import CardDecorator from "../../CardDecorator";
import Decorator from "../../Decorator";

const props = {
  text: "This is message",
  title: "Title",
};
const Story: React.FC<IMessage> = ({
  actionBtn,
  expandText,
  onUndo,
  status,
  title,
  text,
}) => {
  const pushMessage = useNotifier();

  return (
    <Button
      variant="primary"
      onClick={() =>
        pushMessage({
          actionBtn,
          expandText,
          onUndo: onUndo ? () => undefined : undefined,
          status,
          text,
          title,
        })
      }
      style={{ display: "block", margin: "auto" }}
    >
      Push message
    </Button>
  );
};

storiesOf("Generics / Global messages", module)
  .addDecorator(CardDecorator)
  .addDecorator(Decorator)
  .add("default", () => <Story {...props} />)
  .add("with action", () => (
    <Story
      actionBtn={{ action: () => undefined, label: "Action" }}
      {...props}
    />
  ))
  .add("with success status", () => (
    <Story {...props} status="success" title="Success!" />
  ))
  .add("with error status", () => (
    <Story {...props} status="error" title="Error" />
  ))
  .add("with warning status", () => (
    <Story {...props} status="warning" title="Warning" />
  ));
