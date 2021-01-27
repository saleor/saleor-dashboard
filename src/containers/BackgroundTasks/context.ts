import { createContext } from "react";

import { BackgroundTasksContextType } from "./types";

const BackgroundTasksContext = createContext<BackgroundTasksContextType>(null);

export default BackgroundTasksContext;
