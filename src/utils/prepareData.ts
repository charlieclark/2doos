import {
  TodoTree,
  Todo,
  TodoDict,
  TodoGroupsTree,
  TG_ALL,
  TodoGroup,
} from "types";
import { keyBy } from "lodash";
import { getAllChildren, getParentsArray, todoTreeIsFolder } from "./selectors";

export const prepareData = (flatTodos: Todo[], groups: TodoGroup[]) => {
  const todoDict: TodoDict = keyBy(
    flatTodos.map((todo) => ({
      ...todo,
      children: [],
      parents: [],
      allChildren: [],
    })),
    "id"
  );

  const todoTreeArray: TodoTree[] = [];

  const groupsWithAll = [...groups, { id: TG_ALL, name: "All" }];

  const todoGroupsTree: TodoGroupsTree = groupsWithAll.reduce(
    (acc, group) => ({ ...acc, [group.id]: [] }),
    {}
  );

  flatTodos.forEach(({ id }) => {
    const todo = todoDict[id];

    if (todo.parentId) {
      todoDict[todo.parentId].children.push(todo);
    } else {
      todoTreeArray.push(todo);
    }
  });

  [...flatTodos]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .forEach((todo) => {
      const parents = getParentsArray(todoDict[todo.id], todoDict);
      const allChildren = getAllChildren(todoDict[todo.id]);
      
      todoDict[todo.id].parents = parents;
      todoDict[todo.id].allChildren = allChildren;

      if (todoTreeIsFolder(todoDict[todo.id])) {
        return;
      } else if (!todo.timelineGroup) {
        todoGroupsTree[TG_ALL].push(todo.id);
      } else {
        todoGroupsTree[todo.timelineGroup] =
          todoGroupsTree[todo.timelineGroup] || [];
        todoGroupsTree[todo.timelineGroup].push(todo.id);
      }
    });

  return { todoDict, todoTreeArray, todoGroupsTree, todoGroups: groupsWithAll };
};
