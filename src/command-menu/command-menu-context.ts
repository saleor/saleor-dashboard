import React from "react";

type CommandMenuContext = {
  open: boolean;
  contextActions: []; //todo
  // context values?
};

const Context = React.createContext<CommandMenuContext>({
  contextActions: [],
  open: false,
});

export const CommandMenuContext = {
  Provider: Context.Provider,
  use() {
    const ctx = React.useContext(Context);

    if (!ctx) {
      throw new Error("CommandMenuContext must be used within CommandMenuContext.Provider");
    }

    const setActions = (actions: []) => {};
  },
};
