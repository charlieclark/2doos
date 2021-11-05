import { BOARD_ID, TodoDict, TodoTree } from "types";

export const doesTodoContainTodo = (
  todoTree: TodoTree,
  todoId: string
): boolean => {
  return (
    todoTree.id === todoId ||
    todoTree.children.some((child) => doesTodoContainTodo(child, todoId))
  );
};

export const todoTreeIsBoard = (todoTree: TodoTree) => todoTree.id === BOARD_ID;
export const todoTreeParentIsBoard = (todoTree: TodoTree) =>
  todoTree.parentId === BOARD_ID;

export const todoTreeIsProject = (todoTree: TodoTree) =>
  todoTreeParentIsBoard(todoTree);

export const todoTreeIsFolder = (todoTree: TodoTree) =>
  !!todoTree.children.length || !todoTree.parentId;

export const isUnfinishedTask = (todoTree: TodoTree) => {
  return (
    !(todoTreeIsFolder(todoTree) || todoTreeIsProject(todoTree)) &&
    todoTree.status !== "done"
  );
};

export const getAllLeafIds = (todoTree: TodoTree) => {
  const traverse = (acc: string[], node: TodoTree): string[] => {
    if (node.children && node.children.length) {
      return node.children.reduce(traverse, acc);
    }

    acc.push(node.id);
    return acc;
  };

  return traverse([], todoTree);
};

export const getAllChildren = (todoTree: TodoTree) => {
  const traverse = (acc: string[], node: TodoTree): string[] => {
    if (node.children && node.children.length) {
      acc.push(node.id);
      return node.children.reduce(traverse, acc);
    }
    acc.push(node.id);
    return acc;
  };

  return traverse([], todoTree);
};

export const getParentsArray = (todoTree: TodoTree, todoDict: TodoDict) => {
  const traverse = (acc: string[], node: TodoTree): string[] => {
    if (node.parentId) {
      acc.push(node.parentId);
      return traverse(acc, todoDict[node.parentId]);
    }
    return acc;
  };
  return traverse([], todoTree);
};
