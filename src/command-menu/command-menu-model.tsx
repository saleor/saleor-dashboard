import { CommandMenuUi } from "@dashboard/command-menu/command-menu-ui";
import { atom, createStore, Provider, useAtom } from "jotai";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

const commandBarOpen = atom<boolean>(false);
const contextActions = atom([]); // todo
const searchQueryValue = atom<string>("");

const contextActionsStore = createStore();

const useCommandBar = () => {
  const [open, setOpenValue] = useAtom(commandBarOpen);
  const [query, setQuery] = useAtom(searchQueryValue);

  return {
    open,
    query,
    setOpen: () => setOpenValue(true),
    setClose: () => setOpenValue(false),
    updateQuery: (query: string) => setQuery(query),
  };
};

export const CommandMenu = {
  Provider: Provider,
  useCommandBar,
  useRegisterKeyboardShortcut() {
    const { setOpen } = useCommandBar();

    useHotkeys(
      "ctrl+j, meta+j", //todo
      event => {
        event.preventDefault();
        setOpen();

        return false;
      },
      { enableOnFormTags: true },
    );

    // todo: handle escape
  },
};

// maybe we need Provider to scope registered context commands
export const RegisterCommandMenu = () => {
  CommandMenu.useRegisterKeyboardShortcut();

  return <CommandMenuUi />;
};
