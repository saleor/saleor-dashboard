import { createContext, useContext,useState } from "react"

export enum NetworkTabs {
  HEADER,
  REQUEST,
  RESPONSE,
  RESPONSE_RAW,
}

const NetworkTabsContext = createContext<{
  activeTab: number
  setActiveTab: React.Dispatch<React.SetStateAction<number>>
}>({
  activeTab: 1,
  setActiveTab: () => null,
})

export const NetworkTabsProvider: React.FC = ({ children }) => {
  const [activeTab, setActiveTab] = useState(NetworkTabs.REQUEST)

  return (
    <NetworkTabsContext.Provider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </NetworkTabsContext.Provider>
  )
}

export const useNetworkTabs = () => {
  const { activeTab, setActiveTab } = useContext(NetworkTabsContext)

  return {
    activeTab,
    setActiveTab,
  }
}
