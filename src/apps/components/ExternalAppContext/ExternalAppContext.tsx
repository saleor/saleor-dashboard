import { Modal } from "@material-ui/core";
import React from "react";

import { AppFrame } from "../AppFrame";

export interface AppData {
  appToken: string;
  src: string;
  backendUrl: string;
}

const ExternalAppContext = React.createContext<{
  open: boolean;
  appData: AppData | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAppData: React.Dispatch<React.SetStateAction<AppData | undefined>>;
}>(undefined);

export const ExternalAppProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  const [appData, setAppData] = React.useState<AppData | undefined>();

  const handleClose = () => {
    setOpen(false);
    setAppData(undefined);
  };

  return (
    <ExternalAppContext.Provider value={{ open, appData, setOpen, setAppData }}>
      {children}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="extension app modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {open && appData && (
          <AppFrame
            src={appData.src}
            appToken={appData.appToken}
            backendHost={appData.backendUrl}
          />
        )}
      </Modal>
    </ExternalAppContext.Provider>
  );
};

export const useExternalApp = () => {
  const { setOpen, setAppData } = React.useContext(ExternalAppContext);

  const openApp = (appData: AppData) => {
    setOpen(true);
    setAppData(appData);
  };

  return { openApp };
};
