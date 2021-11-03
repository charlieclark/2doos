import { TodoTree } from "types";

export const doesTodoContainTodo = (
  todoTree: TodoTree,
  todoId: string
): boolean => {
  return (
    todoTree.id === todoId ||
    todoTree.children.some((child) => doesTodoContainTodo(child, todoId))
  );
};

export const todoTreeIsFolder = (todoTree: TodoTree) =>
  !!todoTree.children.length || !todoTree.parentId;
