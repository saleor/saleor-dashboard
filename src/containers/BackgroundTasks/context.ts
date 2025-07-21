import { createContext } from "react";

import { BackgroundTasksContextType } from "./types";

const BackgroundTasksContext = createContext<BackgroundTasksContextType>(
  null as unknown as BackgroundTasksContextType,
);

export default BackgroundTasksContext;
