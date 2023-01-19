import { FC } from "react"

export const Panels: FC = (props) => {
  const { children } = props

  return (
    <div className="h-full flex flex-col divide-y divide-solid dark:divide-gray-600">
      {children}
    </div>
  )
}

interface IPanelSectionProps {
  title?: string
  className?: string
}

export const PanelSection: FC<IPanelSectionProps> = (props) => {
  const { title, children, className } = props

  return (
    <div className={`p-4 ${className}`}>
      {title && <div className="font-bold mb-4">{title}</div>}
      <div>{children}</div>
    </div>
  )
}
