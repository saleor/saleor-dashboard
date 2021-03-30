import React from "react";

import ChannelContent, { ChannelContentProps } from "./ChannelContent";
import ChannelContentWrapper, {
  ChannelContentWrapperProps
} from "./ChannelContentWrapper";

type ChannelProps = Omit<
  ChannelContentProps & ChannelContentWrapperProps,
  "isOpen" | "setOpen" | "children"
>;

const Channel: React.FC<ChannelProps> = ({
  messages,
  data,
  disabled,
  errors,
  onChange
}) => (
  <ChannelContentWrapper messages={messages} data={data}>
    <ChannelContent
      data={data}
      onChange={onChange}
      messages={messages}
      errors={errors}
      disabled={disabled}
    />
  </ChannelContentWrapper>
);

export default Channel;
