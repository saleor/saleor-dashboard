import { Modal } from "@material-ui/core";
import { AppFragment } from "@saleor/fragments/types/AppFragment";
import React from "react";

import useAppConfigLoader from "../AppDetailsSettingsPage/useAppConfigLoader";
import { useStyles } from "./styles";

interface Props {
  app: AppFragment;
  backendUrl: string;
  onLoad(): void;
  onError(): void;
}

const AppContainer: React.FC<Props> = ({
  app,
  backendUrl,
  onError,
  onLoad
}) => {
  const classes = useStyles();
  const frameContainer = useAppConfigLoader(app, backendUrl, {
    onLoad,
    onError
  });

  return <div ref={frameContainer} className={classes.iframeContainer} />;
};

export const IFrameOpener: React.FC<Props> = ({
  app,
  backendUrl,
  children
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <button onClick={() => setOpen(!open)}>
      {children}
      <Modal
        open={open}
        aria-labelledby="extension app modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {open && (
          // <iframe src={backendUrl} width={600} height={600} />
          <AppContainer
            app={app}
            backendUrl="extend-install-app-logic-to-handle-extensions.api.saleor.rocks"
            onLoad={() => console.log("app loaded")}
            onError={() => console.log("app error")}
          />
        )}
      </Modal>
    </button>
  );
};
