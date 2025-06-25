import React, { useEffect } from "react";

export const usePreventHistoryBack = (area: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!area.current) return;

    const handleMouseEnter = () => {
      document.body.style.overscrollBehaviorX = "none";
    };

    const handleMouseLeave = () => {
      document.body.style.overscrollBehaviorX = "auto";
    };

    area.current?.addEventListener("mouseenter", handleMouseEnter);
    area.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      area.current?.removeEventListener("mouseenter", handleMouseEnter);
      area.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [area.current]);
};
