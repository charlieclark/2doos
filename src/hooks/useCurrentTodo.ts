import { useParams, useHistory } from "react-router-dom";
import { useGlobalDataContext } from "./useGlobalData";

const useCurrentTodo = () => {
  const { todo: todoId } = useParams() as { todo: string };
  const { todoDict } = useGlobalDataContext();
  const history = useHistory();
  const updateCurrentTodo = (id: string) => {
    history.push(`/${id}`);
  };
  return { todoId, todoTree: todoDict[todoId], updateCurrentTodo };
};

export default useCurrentTodo;
