import useForm from "@saleor/hooks/useForm";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import Metadata, { MetadataProps } from "./Metadata";

const props: MetadataProps = {
  data: {
    metadata: [
      {
        key: "key",
        value: "value"
      },
      {
        key: "key2",
        value: '{\n  "jsonValue": "some-value"\n}'
      },
      {
        key: "key3",
        value: "some-value"
      }
    ],
    privateMetadata: []
  },
  onChange: () => undefined
};

const InteractiveStory: React.FC = () => {
  const { change, data } = useForm(props.data, () => undefined);

  return <Metadata data={data} onChange={change} />;
};

storiesOf("Generics / Metadata", module)
  .addDecorator(Decorator)
  .add("default", () => <Metadata {...props} />)
  .add("loading", () => <Metadata {...props} data={undefined} />)
  .add("interactive", () => <InteractiveStory />);
