import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { useTheme } from "@dashboard/theme";
import { type LucideIcon, Shapes } from "lucide-react";
import { useEffect, useState } from "react";

import { type ModelTypeIcon as ModelTypeIconValue, resolveModelTypeIconHex } from "./constants";
import { getLoadedLucideIcon, loadLucideIcon } from "./loadLucideIcon";

interface ModelTypeIconProps {
  icon: ModelTypeIconValue;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * Icons resolve through a lazy import, so `Shapes` — the fallback for unconfigured types — is
 * imported statically and doubles as the placeholder for the frame before a name resolves.
 * The slot therefore never renders empty and never reflows.
 */
export const ModelTypeIcon = ({
  icon,
  size = iconSize.small,
  strokeWidth = iconStrokeWidthBySize.small,
  className,
}: ModelTypeIconProps) => {
  const { theme } = useTheme();
  const [Loaded, setLoaded] = useState<LucideIcon | null>(
    () => getLoadedLucideIcon(icon.name)?.Component ?? null,
  );

  useEffect(() => {
    const cached = getLoadedLucideIcon(icon.name);

    if (cached) {
      setLoaded(() => cached.Component);

      return;
    }

    let cancelled = false;

    setLoaded(null);
    loadLucideIcon(icon.name).then(loaded => {
      if (!cancelled) {
        setLoaded(() => loaded?.Component ?? null);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [icon.name]);

  const Icon = Loaded ?? Shapes;

  return (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      color={resolveModelTypeIconHex(icon.color, theme === "defaultDark")}
      className={className}
      aria-hidden
    />
  );
};
