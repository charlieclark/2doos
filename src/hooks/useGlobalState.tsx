import * as React from "react";
import { createGenericContext } from "utils/createGenericContext";

type UseGlobalState = {
  activeDragTodoId?: string;
  setActiveDragTodoId: (id?: string) => void;
};

const [useGlobalStateContext, GlobalStateContextProvider] =
  createGenericContext<UseGlobalState>();

const GlobalStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeDragTodoId, setActiveDragTodoId] = React.useState<string>();

  return (
    <GlobalStateContextProvider
      value={{ activeDragTodoId, setActiveDragTodoId }}
    >
      {children}
    </GlobalStateContextProvider>
  );
};

export { useGlobalStateContext, GlobalStateProvider };
