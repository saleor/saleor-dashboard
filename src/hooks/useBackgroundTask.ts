import BackgroundTasksContext from "@saleor/containers/BackgroundTasks/context";
import { useContext } from "react";

const useBackgroundTask = useContext(BackgroundTasksContext);

export default useBackgroundTask;
