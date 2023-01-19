import React from 'react';

import { AutoFormatToggleButton } from "../../../components/AutoFormatToggleButton"
import { Bar } from "../../../components/Bar"
import { CodeView } from "../../../components/CodeView"
import { CopyButton } from "../../../components/CopyButton"
import { HashButton } from "../../../components/HashButton"
import { IGraphqlRequestBody } from "../../../helpers/graphqlHelpers"
import * as safeJson from "../../../helpers/safeJson"
import { Panels, PanelSection } from "./PanelSection"

interface IRequestViewProps {
  autoFormat: boolean
  requests: IGraphqlRequestBody[]
}

interface IRequestViewFooterProps {
  autoFormat: boolean
  toggleAutoFormat: React.DispatchWithoutAction
}

const isVariablesPopulated = (request: IGraphqlRequestBody) => Object.keys(request.variables || {}).length > 0

export const RequestView = (props: IRequestViewProps) => {
  const { requests, autoFormat } = props

  return (
    <Panels>
      {requests.map((request) => (
          <PanelSection key={request.query} className="relative">
            <div className="flex flex-col items-end gap-2 absolute right-3 top-3 z-10 transition-opacity opacity-50 hover:opacity-100">
              <CopyButton label="Copy Query" textToCopy={request.query} />
              {isVariablesPopulated(request) && (
                <CopyButton
                  label="Copy Vars"
                  textToCopy={safeJson.stringify(
                    request.variables,
                    undefined,
                    2
                  )}
                />
              )}
              <HashButton label="Generate Hash" content={{
                query: request.query,
                variables: JSON.stringify(request.variables || {}),
                headers: "{}",
                operationName: "",
              }} />
            </div>
            <CodeView
              text={request.query}
              language={"graphql"}
              autoFormat={autoFormat}
            />
            {isVariablesPopulated(request) && (
              <div className="bg-gray-200 dark:bg-gray-800 rounded-lg">
                <CodeView
                  text={safeJson.stringify(request.variables, undefined, 2)}
                  language={"json"}
                />
              </div>
            )}
          </PanelSection>
        ))}
    </Panels>
  )
}

export const RequestViewFooter = (props: IRequestViewFooterProps) => {
  const { autoFormat, toggleAutoFormat } = props

  return (
    <Bar className="mt-auto absolute border-t">
      <AutoFormatToggleButton active={autoFormat} onToggle={toggleAutoFormat} />
    </Bar>
  )
}
