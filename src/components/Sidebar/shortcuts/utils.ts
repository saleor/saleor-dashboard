export const getShortcutLeadingKey = () => {
  return navigator.appVersion.toLowerCase().includes("mac") ? "⌘" : "Ctrl";
};
