// @ts-strict-ignore
import { createContext } from "react";

import { type BackgroundTasksContextType } from "./types";

const BackgroundTasksContext = createContext<BackgroundTasksContextType>(null);

export default BackgroundTasksContext;
