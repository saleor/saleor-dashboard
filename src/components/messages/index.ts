import { positions } from "react-alert";
export interface IMessage {
  actionBtn?: {
    label: string;
    action: () => void;
  };
  autohide?: number;
  expandText?: string;
  title?: string;
  text: string;
  onUndo?: () => void;
  status?: "success" | "error" | "info" | "warning";
}

export const notificationOptions = {
  containerStyle: {
    zIndex: 1000
  },
  offset: "20px",
  position: positions.TOP_RIGHT,
  timeout: 3000
};

export * from "./MessageManager";
