import * as React from "react";
import { ActiveDrag, getDragEventData } from "types";
import { createGenericContext } from "utils/createGenericContext";

type UseGlobalState = {
  activeDrag?: ActiveDrag;
  setActiveDrag: (...args: Parameters<typeof getDragEventData>) => void;
  clearActiveDrag: () => void;
};

const [useGlobalStateContext, GlobalStateContextProvider] =
  createGenericContext<UseGlobalState>();

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDrag, setActiveDrag] = React.useState<ActiveDrag>();

  return (
    <GlobalStateContextProvider
      value={{
        activeDrag,
        setActiveDrag: (data) => setActiveDrag(getDragEventData(data)),
        clearActiveDrag: () => setActiveDrag(undefined),
      }}
    >
      {children}
    </GlobalStateContextProvider>
  );
};

export { useGlobalStateContext, GlobalStateProvider };
