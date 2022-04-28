import useForm from "@saleor/hooks/useForm";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import { props } from "./fixtures";
import Metadata from "./Metadata";

const InteractiveStory: React.FC = () => {
  const { change, data } = useForm(props.data, () => undefined);

  return <Metadata data={data} onChange={change} />;
};

export default {
  title: "Generics / Metadata",
  decorators: [Decorator]
};

export const Default = () => <Metadata {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => <Metadata {...props} data={undefined} />;

Loading.story = {
  name: "loading"
};

export const Interactive = () => <InteractiveStory />;

Interactive.story = {
  name: "interactive"
};
