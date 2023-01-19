import { ReactNode } from "react"

interface IHeadBodyLayoutProps {
  header: ReactNode
  body: ReactNode
}

export const HeadBodyLayout = (props: IHeadBodyLayoutProps) => {
  const { header, body } = props
  return (
    <div className="h-screen flex flex-col items-stretch overflow-hidden">
      <div>{header}</div>
      <div className="flex-1 relative overflow-auto">{body}</div>
    </div>
  )
}
