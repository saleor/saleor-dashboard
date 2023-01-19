import useCopy from "../../../../hooks/useCopy"
import { useMarkSearch } from "../../../../hooks/useMark"
import { Header } from "../../../../hooks/useNetworkMonitor"

interface IHeadersProps {
  headers: Header[]
}

const HeaderListItem = (props: { header: Header }) => {
  const { header } = props
  const { isCopied, copy } = useCopy()

  const handleClick = (header: Header) => {
    copy(`${header.name}: "${header.value}"`)
  }

  return (
    <li className="p-0 m-0 w-fit relative">
      <button
        onClick={() => handleClick(header)}
        className="text-left dark:text-gray-300 px-3 py-0.5 rounded-md w-fit cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
      >
        <span className="font-bold">{header.name}: </span>
        {header.value}
      </button>
      {isCopied && (
        <div className="rounded-md px-1.5 py-0.5 font-bold text-white  bg-blue-400 dark:bg-blue-600 absolute right-2 -top-4">
          Copied!
        </div>
      )}
    </li>
  )
}

export const HeaderList = (props: IHeadersProps) => {
  const { headers } = props
  const ref = useMarkSearch()

  return (
    <ul className="list-none m-0" ref={ref}>
      {headers.map((header) => (
        <HeaderListItem
          key={`${header.name}:${header.value}`}
          header={header}
        />
      ))}
    </ul>
  )
}
