import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const script = readFileSync(join(process.cwd(), "nginx/replace-env-vars.sh"), "utf8");
const sedLine = script.split("\n").find(line => line.trimStart().startsWith("sed -i "));

if (!sedLine) {
  throw new Error("Replacement command not found");
}

const replacementCommand = sedLine.replace("sed -i ", "sed ").replace(' "$INDEX_BUNDLE_PATH"', "");

describe("replace-env-vars.sh", () => {
  it("does not replace API_URL inside EXTENSIONS_API_URL", () => {
    // Arrange
    const indexHtml = ['        API_URL: "",', '        EXTENSIONS_API_URL: "",', ""].join("\n");
    const command = [
      'var_name="API_URL"',
      'var_value="https://example.com/graphql/"',
      replacementCommand,
    ].join("\n");

    // Act
    const result = execFileSync("sh", ["-c", command], {
      encoding: "utf8",
      input: indexHtml,
    });

    // Assert
    expect(result).toBe(
      [
        '        API_URL: "https://example.com/graphql/",',
        '        EXTENSIONS_API_URL: "",',
        "",
      ].join("\n"),
    );
  });
});
