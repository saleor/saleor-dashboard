import { createContext } from "react";

import { BackgroundTasksContextType } from "./types";

const BackgroundTasksContext = createContext<BackgroundTasksContextType | null>(null);

export default BackgroundTasksContext;
