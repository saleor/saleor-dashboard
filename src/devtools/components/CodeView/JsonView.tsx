import ReactJson from "@notdutzi/react-json-view"
import { useDarkTheme } from "../../hooks/useTheme"

type JsonViewProps = {
  src: object
  collapsed?: number
}

export const JsonView = (props: JsonViewProps) => {
  const isDarkTheme = useDarkTheme()

  return (
    <div className="p-4">
      <ReactJson
        name={null}
        src={props.src}
        theme={isDarkTheme ? "tomorrow" : "rjv-default"}
        style={{
          fontFamily:
            'Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata", "Courier New", monospace',
        }}
        enableClipboard={false}
        displayDataTypes={false}
        displayObjectSize={true}
        collapsed={props.collapsed || 2}
      />
    </div>
  )
}
