import { AppLogo } from "@dashboard/extensions/types";

export interface AppAvatarProps {
  logo?: AppLogo;
  name: string;
  size?: number;
  borderRadius?: number;
}

export const AppAvatar = ({ logo, name, size = 40, borderRadius = 50 }: AppAvatarProps) => {
  const logoSource = logo?.light?.source;

  if (logoSource) {
    return (
      <img
        src={logoSource}
        alt={`${name} logo`}
        style={{
          width: size,
          height: size,
          borderRadius: typeof borderRadius === "number" ? `${borderRadius}%` : borderRadius,
        }}
      />
    );
  }

  // Fallback to name initials
  const initials = name
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}%` : borderRadius,
        backgroundColor: "#1f2937",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.4,
        fontWeight: "bold",
      }}
    >
      {initials}
    </div>
  );
};
