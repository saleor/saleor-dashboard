import { Box, Text } from "@saleor/macaw-ui-next";
import { GripVertical, X } from "lucide-react";
import { useRef, useState } from "react";

import { useDevTools } from "./DevToolsProvider";

export const DevToolsPanel = () => {
  const { isVisible, toggle, panels, activePanel, setActivePanel } = useDevTools();

  const [position, setPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: window.innerWidth - e.clientX - position.x,
      y: window.innerHeight - e.clientY - position.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: Math.max(0, window.innerWidth - e.clientX - dragOffset.current.x),
        y: Math.max(0, window.innerHeight - e.clientY - dragOffset.current.y),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!isVisible || panels.length === 0) {
    return null;
  }

  const ActiveComponent = panels.find(p => p.id === activePanel)?.component;

  return (
    <Box
      position="fixed"
      __zIndex="10000"
      backgroundColor="default1"
      borderRadius={3}
      boxShadow="defaultModal"
      borderColor="default1"
      borderWidth={1}
      borderStyle="solid"
      __width="420px"
      __maxHeight="500px"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      style={{
        right: position.x,
        bottom: position.y,
        userSelect: isDragging ? "none" : "auto",
      }}
    >
      {/* Header with drag handle */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={3}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
      >
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <GripVertical size={14} style={{ opacity: 0.5 }} />
          <Text size={2} fontWeight="medium">
            🔧 DevTools
          </Text>
        </Box>
        <Box
          as="button"
          onClick={toggle}
          cursor="pointer"
          padding={1}
          borderRadius={2}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="default2"
          borderWidth={0}
          __backgroundColor="transparent"
          style={{ outline: "none" }}
        >
          <X size={14} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box
        display="flex"
        gap={1}
        padding={2}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
      >
        {panels.map(panel => (
          <Box
            key={panel.id}
            as="button"
            onClick={() => setActivePanel(panel.id)}
            paddingX={2}
            paddingY={1}
            borderRadius={2}
            cursor="pointer"
            borderWidth={0}
            backgroundColor={activePanel === panel.id ? "default2" : "transparent"}
            style={{ outline: "none" }}
          >
            <Text size={1} color={activePanel === panel.id ? "default1" : "default2"}>
              {panel.label}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Content */}
      <Box flexGrow="1" overflow="auto">
        {ActiveComponent && <ActiveComponent />}
      </Box>
    </Box>
  );
};
