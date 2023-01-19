import cx from "classnames"
import { FC,ReactElement } from "react"

interface IButtonProps {
  icon?: ReactElement
  onClick?: () => void
  className?: string
  variant?: "default" | "contained"
  testId?: string
}

const defaultVariantStyle = `
  text-gray-500 hover:text-gray-700
  dark:text-gray-400 dark:hover:text-gray-300
`

const containedVariantStyle = `
  text-gray-600 hover:text-gray-800
  bg-gray-300 hover:bg-gray-300

  dark:text-gray-400 dark:hover:text-white
  dark:bg-gray-700 dark:hover:bg-gray-600
  p-2 px-2.5
`

export const Button: FC<IButtonProps> = (props) => {
  const {
    children,
    icon,
    onClick,
    variant = "default",
    className,
    testId,
  } = props

  return (
    <button
      onClick={onClick}
      className={cx(
        "flex justify-center items-center rounded-lg font-bold transition",
        {
          [defaultVariantStyle]: variant === "default",
          [containedVariantStyle]: variant === "contained",
          [className || ""]: true,
        }
      )}
      data-testid={testId}
    >
      {icon && <span>{icon}</span>}
      {children && <span className={icon && "pl-2"}>{children}</span>}
    </button>
  )
}
