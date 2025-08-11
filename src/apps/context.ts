import { atom, createStore, Provider, useAtom } from "jotai";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

export interface AppListContextValues {
  removeAppInstallation: (installationId: string) => void;
  retryAppInstallation: (installationId: string) => void;
}

export const AppListContext = React.createContext<AppListContextValues | undefined>(undefined);

export const useAppListContext = () => {
  const context = React.useContext(AppListContext);

  if (!context) {
    throw new Error("useAppListContext must be used within a AppListContext");
  }

  return context;
};

const commandBarOpen = atom<boolean>(false);
const contextActions = atom([]); // todo

const contextActionsStore = createStore();

const useCommandBar = () => {
  const [open, setOpenValue] = useAtom(commandBarOpen);

  return {
    open: open,
    setOpen: () => setOpenValue(true),
    setClose: () => setOpenValue(false),
  };
};

export const CommandBar = {
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
  },
};

// maybe we need Provider to scope registered context commands
export const RegisterCommandMenu = () => {
  CommandBar.useRegisterKeyboardShortcut();

  return null;
};
