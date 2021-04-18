import useTheme from "@saleor/hooks/useTheme";
import React from "react";

const ChevronDown: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L5 5L9 1"
        stroke={isDark ? "#FAFAFA" : "#28234A"}
        stroke-opacity="0.4"
        stroke-width="2"
      />
    </svg>
  );
};

export default ChevronDown;
