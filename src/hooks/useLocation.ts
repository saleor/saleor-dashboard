import { useLocation } from "react-router";

interface StateType {
  previousPage?: string;
}

function useNavigatorLocation() {
  return useLocation<StateType>();
}

export default useNavigatorLocation;
