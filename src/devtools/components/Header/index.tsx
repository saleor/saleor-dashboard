import { FC, ReactNode } from "react"

interface IHeaderProps {
  leftContent?: ReactNode
  rightContent?: ReactNode
  className?: string
}

export const Header: FC<IHeaderProps> = (props) => {
  const { rightContent, leftContent, children, className } = props

  return (
    <div
      className={`flex dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 ${className}`}
    >
      {leftContent && leftContent}
      {children}
      {rightContent && (
        <div className="ml-auto flex items-center">{rightContent}</div>
      )}
    </div>
  )
}
