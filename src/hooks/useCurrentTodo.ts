import { useParams, useHistory } from "react-router-dom";
import { useGlobalDataContext } from "./useGlobalData";
import { useGlobalStateContext } from "./useGlobalState";

const useCurrentTodo = () => {
  const { todo: todoId } = useParams() as { todo: string };
  const { todoDict } = useGlobalDataContext();
  const { clearActiveSearch, setIsShowingKanban } = useGlobalStateContext();
  const history = useHistory();
  const updateCurrentTodo = (id: string) => {
    clearActiveSearch();
    setIsShowingKanban(false);
    history.push(`/${id}`);
  };
  return { todoId, todoTree: todoDict[todoId], updateCurrentTodo };
};

export default useCurrentTodo;
