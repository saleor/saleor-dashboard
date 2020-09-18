import useForm from "@saleor/hooks/useForm";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import { props } from "./fixtures";
import Metadata from "./Metadata";

const InteractiveStory: React.FC = () => {
  const { change, data } = useForm(props.data, () => undefined);

  return <Metadata data={data} onChange={change} />;
};

storiesOf("Generics / Metadata", module)
  .addDecorator(Decorator)
  .add("default", () => <Metadata {...props} />)
  .add("loading", () => <Metadata {...props} data={undefined} />)
  .add("interactive", () => <InteractiveStory />);
