import { useMemo } from "react"

import { CopyButton } from "../../../components/CopyButton"
import * as safeJson from "../../../helpers/safeJson"
import { JsonView } from "../../CodeView"

interface IResponseViewProps {
  response?: string
  collapsed?: number
}

export const ResponseView = (props: IResponseViewProps) => {
  const { response, collapsed } = props
  const { formattedJson, parsedResponse } = useMemo(() => {
    const parsedResponse = safeJson.parse(response) || {}
    return {
      formattedJson: safeJson.stringify(parsedResponse, undefined, 2),
      parsedResponse,
    }
  }, [response])

  return (
    <div className="relative p-4">
      <CopyButton
        textToCopy={formattedJson}
        className="absolute right-3 top-3 z-10"
      />
      <JsonView src={parsedResponse} collapsed={collapsed} />
    </div>
  )
}
