import { parseDiffFromFile } from "@pierre/diffs";
import { FileDiff } from "@pierre/diffs/react";
import { useTheme } from "@saleor/macaw-ui-next";
import { useMemo } from "react";

interface ManifestDiffProps {
  currentManifest: string;
  incomingManifest: string;
}

const formatManifest = (rawJson: string): string => {
  try {
    return JSON.stringify(JSON.parse(rawJson), null, 2) + "\n";
  } catch {
    return rawJson;
  }
};

// Loaded with React.lazy from AppReloadDialog — @pierre/diffs bundles shiki,
// which must stay out of the main chunk.
export const ManifestDiff = ({ currentManifest, incomingManifest }: ManifestDiffProps) => {
  const { theme } = useTheme();
  const fileDiff = useMemo(
    () =>
      parseDiffFromFile(
        { name: "manifest.json", contents: formatManifest(currentManifest) },
        { name: "manifest.json", contents: formatManifest(incomingManifest) },
      ),
    [currentManifest, incomingManifest],
  );

  return (
    <FileDiff
      fileDiff={fileDiff}
      // Constrain the diff to its container so the library's internal
      // horizontal scrolling engages instead of stretching the modal.
      style={{ maxWidth: "100%", minWidth: 0 }}
      options={{
        theme: theme === "defaultDark" ? "pierre-dark" : "pierre-light",
        overflow: "scroll",
      }}
    />
  );
};
