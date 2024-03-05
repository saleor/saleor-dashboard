export const getControlKey = () => {
  return navigator.appVersion.toLowerCase().includes("mac") ? "⌘" : "Ctrl";
};
