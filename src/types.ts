import { get } from "lodash";
import { v4 as uuidv4 } from "uuid";

export const BOARD_ID = "board";
export const TG_ALL = "tg-all";

export enum DD_TYPES {
  project = "project",
  todoProject = "todoProject",
  todoTimeline = "todoTimeline",
  todoTimelineGroup = "todoTimelineGroup",
}

export type ActiveDrag = {
  type: DD_TYPES;
  id: string;
  containerId?: string;
};

export const appendPrefix = (id: string, type: DD_TYPES) => {
  return `${type}-${id}`;
};

export const containsPrefix = (id: string, type: DD_TYPES) =>
  id.startsWith(`${type}-`);

export const removePrefix = (id: string, type: DD_TYPES) =>
  id.replace(`${type}-`, "");

export const getDragEventData = ({ data }: { data: any }) => {
  return {
    type: data.current.type,
    id: data.current.id,
    containerId: get(data.current, "sortable.containerId"),
  } as ActiveDrag;
};

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
  parents: string[];
  allChildren: string[];
};

export type TodoDict = {
  [id: string]: TodoTree;
};

export const generateTodoTree = (todo: Omit<Todo, "id" | "orderIndex">) => {
  return {
    ...todo,
    id: uuidv4(),
    orderIndex: 0,
  };
};

// GROUP stuff

export type TodoGroup = {
  id: string;
  name: string;
};

export type TodoGroupCreate = Pick<TodoGroup, "name">;
export type TodoGroupEdit = Partial<Pick<TodoGroup, "name">>;

export type TodoGroupsTree = {
  [id: string]: string[];
};
