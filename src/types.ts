import { uniqueId } from "lodash";

export const TG_ALL = "tg-all";

export enum TodoTypes {
  todo = "todo",
  folder = "folder",
}

export type Todo = {
  id: string;
  name: string;
  notes: string;
  parentId?: string;
  status?: "done";
  timelineGroup?: string;
  orderIndex: number;
};

export type TodoEdit = Partial<
  Pick<Todo, "name" | "notes" | "status" | "timelineGroup" | "orderIndex">
>;

export type TodoCreate = Partial<Pick<Todo, "name" | "notes">>;

export type TodoTree = Todo & {
  children: TodoTree[];
};

export type TodoDict = {
  [id: string]: TodoTree;
};

export type TodoGroup = {
  id: string;
  name: string;
};

export type TodoGroupsTree = {
  [id: string]: string[];
};

export const generateTodoTree = (todo: Omit<TodoTree, "id" | "orderIndex">) => {
  return {
    ...todo,
    id: `todo-${uniqueId()}`,
    orderIndex: 0,
    children: [],
  };
};
