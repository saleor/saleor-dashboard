import { FC } from "react"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBadgeProps {
  //
}

export const Badge: FC<IBadgeProps> = (props) => {
  const { children } = props

  return (
    <span className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded-md font-bold shadow-sm">
      {children}
    </span>
  )
}
