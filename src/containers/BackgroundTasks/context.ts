import { createContext } from "React";

import { BackgroundTasksContextType } from "./types";

const BackgroundTasksContext = createContext<BackgroundTasksContextType>(null);

export default BackgroundTasksContext;
