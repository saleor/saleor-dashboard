import React, { ReactNode } from "react";

import { MessageContext } from ".";
import { MessageDisplay } from "./MessageDisplay";
import { useMessageState } from "./useMessageState";

const MessageManagerProvider = ({ children }: { children: ReactNode }) => {
  const { context, componentState } = useMessageState();

  return (
    <>
      {/* This component is used in main `App` component, to pass context */}
      <MessageContext.Provider value={context}>{children}</MessageContext.Provider>
      <MessageDisplay {...componentState} />
    </>
  );
};

export default MessageManagerProvider;
