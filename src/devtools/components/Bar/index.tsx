import React from "react"

interface IBarProps {
  children: React.ReactNode
  className?: string
  testId?: string
}

export const Bar = (props: IBarProps) => {
  const { children, className, testId } = props

  return (
    <div
      className={`relative flex items-center w-full p-2 dark:bg-gray-800 border-gray-300 dark:border-gray-600 space-x-6 ${className}`}
      data-testid={testId}
    >
      {children}
    </div>
  )
}
