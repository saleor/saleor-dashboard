import { ReactElement } from "react"
import SplitPane from "react-split-pane"
import { HeadBodyLayout } from "./HeadBodyLayout"

interface ISplitPaneLayoutProps {
  header?: ReactElement
  leftPane?: ReactElement
  rightPane?: ReactElement
}

export const SplitPaneLayout = (props: ISplitPaneLayoutProps) => {
  const { header, rightPane, leftPane } = props

  if (!leftPane || !rightPane) {
    return <HeadBodyLayout header={header} body={leftPane || rightPane} />
  }

  return (
    <HeadBodyLayout
      header={header}
      body={
        <div className="flex flex-col">
          <SplitPane split="vertical" minSize={130} defaultSize={210}>
            {leftPane}
            {rightPane}
          </SplitPane>
        </div>
      }
    />
  )
}
