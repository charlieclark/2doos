import * as React from "react";
import * as ls from "local-storage";
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
  BOARD_ID,
  TodoGroupEdit,
  TodoGroupCreate,
} from "types";
import { createGenericContext } from "utils/createGenericContext";
import { prepareData } from "utils/prepareData";
import { arrayMove } from "@dnd-kit/sortable";
import { getAllChildren } from "utils/selectors";
import { v4 as uuidv4 } from "uuid";
import { useGlobalStateContext } from "./useGlobalState";

type UseGlobalData = {
  todoDict: TodoDict;
  todoTreeArray: TodoTree[];
  todoGroupsTree: TodoGroupsTree;
  todoGroups: TodoGroup[];
  reorderTodos: (id1: string, id2: string) => void;
  reorderGroupTodos: (groupId: string, id1: string, id2: string) => void;
  moveIntoFolder: (sourceId: string, destId: string) => void;
  addTodo: (
    parentId?: string,
    data?: TodoCreate,
    addToBottom?: boolean
  ) => void;
  editTodo: (id: string, changes: TodoEdit) => void;
  editTodos: (
    ids: string[],
    cb: (todo: Todo, index: number) => TodoEdit
  ) => void;
  deleteTodo: (id: string) => void;
  addTodoGroup: (data: TodoGroupCreate) => void;
  editTodoGroup: (id: string, changes: TodoGroupEdit) => void;
  reorderTodoGroup: (id: string, direction: "up" | "down") => void;
  deleteTodoGroup: (id: string) => void;
};

const [useGlobalDataContext, GlobalDataContextProvider] =
  createGenericContext<UseGlobalData>();

const BASE_TODOS: Todo[] = [
  {
    name: "My Board",
    id: BOARD_ID,
    notes: "",
    orderIndex: 0,
  },
];

const GlobalDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [storedTodos, setStoredTodosRaw] = React.useState<Todo[]>(
    ls.get("todos") || BASE_TODOS
  );

  const [storedGroups, setStoredGroupsRaw] = React.useState<TodoGroup[]>(
    ls.get("todoGroups") || TIMELINE_GROUPS
  );

  const { todoDict, todoTreeArray, todoGroups, todoGroupsTree } = prepareData(
    storedTodos,
    storedGroups
  );

  const setStoredTodos = (todos: Todo[]) => {
    setStoredTodosRaw(todos);
    ls.set("todos", todos);
  };

  const setStoredGroups = (todoGroups: TodoGroup[]) => {
    setStoredGroupsRaw(todoGroups);
    ls.set("todoGroups", todoGroups);
  };

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
    if (sourceId === destId) {
      return;
    }
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

  const addTodo = (
    parentId?: string,
    data?: TodoCreate,
    addToBottom?: boolean
  ) => {
    const newTodo = generateTodoTree({
      name: "New Task",
      notes: "",
      parentId,
      ...data,
    });
    setStoredTodos([
      ...(!addToBottom ? [newTodo] : []),
      ...storedTodos.map((todo) => {
        if (todo.id === parentId) {
          return { ...todo, status: undefined };
        }
        return todo;
      }),
      ...(addToBottom ? [newTodo] : []),
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

  const editTodos = (
    ids: string[],
    cb: (todo: Todo, index: number) => TodoEdit
  ) => {
    setStoredTodos(
      storedTodos.map((todo, index) => {
        if (ids.includes(todo.id)) {
          return {
            ...todo,
            ...cb(todo, index),
          };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: string) => {
    setStoredTodos(
      storedTodos.filter((todo) => {
        return !todoDict[id].allChildren.includes(todo.id);
      })
    );
  };

  const addTodoGroup = (data: TodoGroupCreate) => {
    setStoredGroups([...storedGroups, { id: uuidv4(), ...data }]);
  };
  const editTodoGroup = (id: string, changes: TodoGroupEdit) => {
    setStoredGroups(
      storedGroups.map((group) => {
        if (group.id === id) {
          return { ...group, ...changes };
        }
        return group;
      })
    );
  };
  const reorderTodoGroup = (id: string, direction: "up" | "down") => {
    const index1 = storedGroups.findIndex((group) => group.id === id);
    const index2 = index1 + (direction === "up" ? -1 : 1);

    const newData = arrayMove(storedGroups, index1, index2);

    setStoredGroups(newData);
  };

  const deleteTodoGroup = (id: string) => {
    setStoredGroups(storedGroups.filter((group) => group.id !== id));
    setStoredTodos(
      storedTodos.map((todo) => {
        if (todo.timelineGroup === id) {
          return { ...todo, timelineGroup: undefined };
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
        editTodos,
        deleteTodo,
        addTodoGroup,
        editTodoGroup,
        reorderTodoGroup,
        deleteTodoGroup,
      }}
    >
      {children}
    </GlobalDataContextProvider>
  );
};

export { useGlobalDataContext, GlobalDataProvider };
