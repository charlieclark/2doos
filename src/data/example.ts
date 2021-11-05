import { Todo } from "../types";

let inc = 0;

export const TEST_DATA: Todo[] = [
  // {
  //   id: "1",
  //   name: "Project 1",
  //   notes: "This is a root project",
  // },
  // {
  //   id: "4",
  //   parentId: "2",
  //   name: "Item 2",
  //   notes: "",
  // },
  // {
  //   id: "2",
  //   parentId: "1",
  //   name: "Item 1",
  //   notes: "",
  // },
  // {
  //   id: "6",
  //   parentId: "1",
  //   name: "Item 6",
  //   notes: "",
  // },
  // {
  //   id: "7",
  //   parentId: "1",
  //   name: "Item 7",
  //   notes: "",
  // },
  // {
  //   id: "5",
  //   parentId: "3",
  //   name: "Item 3",
  //   notes: "",
  // },
  // {
  //   id: "3",
  //   name: "Project 2",
  //   notes: "This is a root project",
  // },
].map((todo: any) => ({ ...todo, orderIndex: ++inc }));

export const TIMELINE_GROUPS = [
  {
    id: "tg-1",
    name: "Todo Next",
  },
];
