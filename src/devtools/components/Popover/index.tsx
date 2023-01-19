import { Popover as HeadlessPopover } from "@headlessui/react"

interface IPopoverProps {
  position?: { top?: number; bottom?: number; left?: number; right?: number }
  className?: string
  button: React.ReactNode
  children: React.ReactNode
}

export const Popover = (props: IPopoverProps) => {
  const { position, button, children, className } = props

  return (
    <HeadlessPopover className="relative">
      <HeadlessPopover.Button as="div">{button}</HeadlessPopover.Button>
      <HeadlessPopover.Overlay className="fixed z-50 inset-0 bg-black opacity-30" />
      <HeadlessPopover.Panel
        className={`absolute z-50 ${className}`}
        style={position || { right: 0 }}
      >
        <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-gray-300 dark:bg-gray-900 shadow-lg">
          {children}
        </div>
      </HeadlessPopover.Panel>
    </HeadlessPopover>
  )
}
