import { Modal } from "@material-ui/core";
import { AppFragment } from "@saleor/fragments/types/AppFragment";
import React from "react";

import { AppFrame } from "../AppFrame";

interface Props {
  app: AppFragment;
  src: string;
  backendUrl: string;
  onLoad?(): void;
  onError?(): void;
}

export const IFrameOpener: React.FC<Props> = ({
  app,
  src,
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
          <AppFrame
            src={src}
            appToken={app.accessToken}
            backendHost={backendUrl}
          />
        )}
      </Modal>
    </button>
  );
};
