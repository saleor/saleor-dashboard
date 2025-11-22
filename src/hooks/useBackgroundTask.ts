import BackgroundTasksContext from "@dashboard/containers/BackgroundTasks/context";
import { useContext } from "react";

function useBackgroundTask() {
  const context = useContext(BackgroundTasksContext);

  if (!context) {
    throw new Error("useBackgroundTask must be used within BackgroundTasksProvider");
  }

  return context;
}

export default useBackgroundTask;
