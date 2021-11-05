import * as React from "react";
import { ActiveDrag, getDragEventData } from "types";
import { createGenericContext } from "utils/createGenericContext";

type UseGlobalState = {
  activeDrag?: ActiveDrag;
  setActiveDrag: (...args: Parameters<typeof getDragEventData>) => void;
  clearActiveDrag: () => void;
  activeSearch?: string;
  isSearchFocused?: boolean;
  isShowingKanban?: boolean;
  setIsSearchFocused: (isFocused: boolean) => void;
  setActiveSearch: (search: string) => void;
  clearActiveSearch: () => void;
  setIsShowingKanban: (show: boolean) => void;
};

const [useGlobalStateContext, GlobalStateContextProvider] =
  createGenericContext<UseGlobalState>();

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDrag, setActiveDrag] = React.useState<ActiveDrag>();
  const [activeSearch, setActiveSearch] = React.useState<string>();
  const [isSearchFocused, setIsSearchFocused] = React.useState<boolean>();
  const [isShowingKanban, setIsShowingKanban] = React.useState<boolean>();

  return (
    <GlobalStateContextProvider
      value={{
        activeDrag,
        setActiveDrag: (data) => setActiveDrag(getDragEventData(data)),
        clearActiveDrag: () => setActiveDrag(undefined),
        activeSearch,
        setActiveSearch,
        clearActiveSearch: () => setActiveSearch(""),
        isSearchFocused,
        setIsSearchFocused,
        isShowingKanban,
        setIsShowingKanban,
      }}
    >
      {children}
    </GlobalStateContextProvider>
  );
};

export { useGlobalStateContext, GlobalStateProvider };
