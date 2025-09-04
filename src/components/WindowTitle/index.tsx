import useShop from "@dashboard/hooks/useShop";
import { Helmet } from "react-helmet";

interface WindowTitleProps {
  title: string;
}

export const WindowTitle = ({ title }: WindowTitleProps) => {
  const shop = useShop();

  return shop === undefined || !title ? null : <Helmet title={`${title} | ${shop.name}`} />;
};
