import { MetadataProps } from "./Metadata";

export const props: MetadataProps = {
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
