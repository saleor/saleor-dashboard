import { FC } from "react"

import { Button } from "../Button"
import { CloseIcon } from "../Icons/CloseIcon"

interface ICloseButtonProps {
  onClick: () => void
  testId?: string
  className?: string
}

export const CloseButton: FC<ICloseButtonProps> = (props) => {
  const { children, onClick, className, testId } = props
  return (
    <Button
      icon={<CloseIcon />}
      onClick={onClick}
      className={`w-10 ${className}`}
      testId={testId}
    >
      {children}
    </Button>
  )
}
