import { useMemo } from "react"

import * as safeJson from "../../../helpers/safeJson"
import { CodeView } from "../../CodeView"
import { CopyButton } from "../../CopyButton"

interface IResponseRawViewProps {
  response?: string
}

const useFormatResponse = (response?: string): string => useMemo(() => {
    if (!response) {
      return "{}"
    }

    // We remove the "extensions" prop as this is just meta data
    // for things like "tracing" and can be huge in size.
    const parsedResponse = safeJson.parse<{ extensions?: string }>(response)
    if (!parsedResponse) {
      return ""
    }

    if ("extensions" in parsedResponse) {
      delete parsedResponse.extensions
    }

    return safeJson.stringify(parsedResponse, undefined, 2)
  }, [response])

export const ResponseRawView = (props: IResponseRawViewProps) => {
  const { response } = props
  const formattedJson = useFormatResponse(response)

  return (
    <div className="relative p-4">
      <CopyButton
        textToCopy={formattedJson}
        className="absolute right-3 top-3 z-10"
      />
      <CodeView text={formattedJson} language={"json"} />
    </div>
  )
}
