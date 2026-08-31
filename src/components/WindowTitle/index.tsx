import useShop from "@dashboard/hooks/useShop";
import { useEffect } from "react";

interface WindowTitleProps {
  title: string;
}

export const WindowTitle = ({ title }: WindowTitleProps) => {
  const shopName = useShop()?.name;

  useEffect(() => {
    if (!shopName || !title) {
      return;
    }

    const previousTitle = document.title;

    document.title = `${title} | ${shopName}`;

    // Restore so unmounting a nested title falls back to the enclosing section's
    return () => {
      document.title = previousTitle;
    };
  }, [title, shopName]);

  return null;
};
