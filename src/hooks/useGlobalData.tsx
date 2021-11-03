import * as React from "react";
import { TEST_DATA, TIMELINE_GROUPS } from "data/example";
import {
  TodoDict,
  TodoTree,
  generateTodoTree,
  Todo,
  TodoEdit,
  TodoGroupsTree,
  TodoGroup,
  TodoCreate,
} from "types";
import { createGenericContext } from "utils/createGenericContext";
import { prepareData } from "utils/prepareData";
import { arrayMove } from "@dnd-kit/sortable";

type UseGlobalData = {
  todoDict: TodoDict;
  todoTreeArray: TodoTree[];
  todoGroupsTree: TodoGroupsTree;
  todoGroups: TodoGroup[];
  reorderTodos: (id1: string, id2: string) => void;
  reorderGroupTodos: (groupId: string, id1: string, id2: string) => void;
  moveIntoFolder: (sourceId: string, destId: string) => void;
  addTodo: (parentId?: string, data?: TodoCreate) => void;
  editTodo: (id: string, changes: TodoEdit) => void;
};

const [useGlobalDataContext, GlobalDataContextProvider] =
  createGenericContext<UseGlobalData>();

const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedTodos, setStoredTodos] = React.useState<Todo[]>(TEST_DATA);
  const [storedGroups, setStoredGroups] =
    React.useState<TodoGroup[]>(TIMELINE_GROUPS);

  const { todoDict, todoTreeArray, todoGroups, todoGroupsTree } = prepareData(
    storedTodos,
    storedGroups
  );

  const reorderTodos = (id1: string, id2: string) => {
    const index1 = storedTodos.findIndex((todo) => todo.id === id1);
    const index2 = storedTodos.findIndex((todo) => todo.id === id2);

    const newData = arrayMove(storedTodos, index1, index2);

    setStoredTodos(newData);
  };

  const reorderGroupTodos = (groupId: string, id1: string, id2: string) => {
    const groupTodoIds = todoGroupsTree[groupId];

    const index1 = groupTodoIds.findIndex((todoId) => todoId === id1);
    const index2 = groupTodoIds.findIndex((todoId) => todoId === id2);

    const newGroupTodoIndexes: { [id: string]: { index: number } } = arrayMove(
      groupTodoIds,
      index1,
      index2
    ).reduce((acc, id, index) => ({ ...acc, [id]: { index } }), {});

    setStoredTodos(
      storedTodos.map((todo) => {
        if (newGroupTodoIndexes[todo.id]) {
          return {
            ...todo,
            orderIndex: newGroupTodoIndexes[todo.id].index,
          };
        }
        return todo;
      })
    );
  };

  const moveIntoFolder = (sourceId: string, destId: string) => {
    setStoredTodos([
      {
        ...storedTodos.find((todo) => todo.id === sourceId)!,
        parentId: destId,
      },
      ...storedTodos
        .filter((todo) => todo.id !== sourceId)
        .map((todo) => {
          if (todo.id === destId) {
            return { ...todo, status: undefined };
          }
          return todo;
        }),
    ]);
  };

  const addTodo = (parentId?: string, data?: TodoCreate) => {
    setStoredTodos([
      generateTodoTree({
        name: "New Todo",
        notes: "",
        children: [],
        parentId,
        ...data,
      }),
      ...storedTodos.map((todo) => {
        if (todo.id === parentId) {
          return { ...todo, status: undefined };
        }
        return todo;
      }),
    ]);
  };

  const editTodo = (id: string, changes: TodoEdit) => {
    setStoredTodos(
      storedTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            ...changes,
          };
        }
        return todo;
      })
    );
  };

  return (
    <GlobalDataContextProvider
      value={{
        todoDict,
        todoTreeArray,
        todoGroupsTree,
        todoGroups,
        reorderGroupTodos,
        reorderTodos,
        moveIntoFolder,
        addTodo,
        editTodo,
      }}
    >
      {children}
    </GlobalDataContextProvider>
  );
};

export { useGlobalDataContext, GlobalDataProvider };
