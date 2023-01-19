import { FC } from "react"

interface IDotProps {
  title?: string
}

export const Dot: FC<IDotProps> = (props) => {
  const { title, children } = props

  return (
    <div
      title={title}
      data-testid="dot"
      className="h-7 w-7 flex items-center justify-center text-center text-sm font-bold leading-none text-white dark:bg-red-600 bg-red-500 rounded-full"
      style={{ transform: "rotate(0.1deg)" }}
    >
      {children}
    </div>
  )
}
