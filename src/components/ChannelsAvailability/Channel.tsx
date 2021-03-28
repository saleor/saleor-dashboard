import React, { useState } from "react";

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
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <ChannelContentWrapper
      isOpen={isOpen}
      setOpen={setOpen}
      messages={messages}
      data={data}
    >
      <ChannelContent
        data={data}
        onChange={onChange}
        messages={messages}
        errors={errors}
        disabled={disabled}
      />
    </ChannelContentWrapper>
  );
};

export default Channel;
