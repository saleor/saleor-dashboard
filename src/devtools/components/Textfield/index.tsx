import React from "react"

type ITextfieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  testId?: string
}

const className =
  "dark:bg-gray-900 border border-gray-300 dark:border-gray-600 px-3 py-1 text-lg rounded-lg"

export const Textfield = React.forwardRef<HTMLInputElement, ITextfieldProps>(
  (props, ref) => {
    const { testId, ...rest } = props

    return (
      <input
        type="text"
        {...rest}
        ref={ref}
        className={`${props.className ?? ""} ${className}`}
        data-testid={testId}
      />
    )
  }
)
