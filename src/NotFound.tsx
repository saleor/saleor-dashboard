import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import useNavigator from "./hooks/useNavigator";

export const NotFound = () => {
  const navigate = useNavigator();

  return <NotFoundPage onBack={() => navigate("/")} />;
};
export default NotFound;
