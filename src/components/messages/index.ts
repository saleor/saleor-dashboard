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
    display: "grid",
    gridTemplateRows: "repeat(auto-fill, minmax(90px, 1fr)",
    justifyContent: "end",
    zIndex: 1200
  },

  position: positions.TOP_RIGHT,
  timeout: 3000
};

export * from "./MessageManager";
