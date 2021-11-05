import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useCurrentTodo from "hooks/useCurrentTodo";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { BOARD_ID, DD_TYPES, TodoTree } from "types";
import {
  doesTodoContainTodo,
  todoTreeIsUnfinishedTask,
  todoTreeIsFolder,
  todoTreeIsProject,
} from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { useGlobalStateContext } from "hooks/useGlobalState";
import {
  Badge,
  Button,
  Card,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ColumnInner from "utils/components/ColumnInner";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ListAltIcon from "@mui/icons-material/ListAlt";
import styles from "./ColOne.module.scss";
import classNames from "classnames";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DashboardIcon from "@mui/icons-material/Dashboard";
import getIconForTodo from "utils/getIconForTodo";

const Folder = ({
  todoTree,
  indentation = 0,
}: {
  todoTree: TodoTree;
  indentation?: number;
}) => {
  const { id, name, children, allChildren } = todoTree;
  const { todoId, updateCurrentTodo } = useCurrentTodo();
  const isActive = todoId === id;
  const { activeDrag } = useGlobalStateContext();
  const { todoDict } = useGlobalDataContext();

  const isDraggingProject = activeDrag?.type === DD_TYPES.project;
  const isDraggingValidTodoProject =
    activeDrag?.type === DD_TYPES.todoProject &&
    todoDict[activeDrag.id].parentId !== id &&
    activeDrag.id !== id &&
    !todoDict[activeDrag.id].allChildren.includes(id);

  const isDroppable = isDraggingValidTodoProject;

  const { setNodeRef, isOver } = useDroppable({
    disabled: !isDroppable,
    id: `col-one-folder-${id}`,
    data: { type: DD_TYPES.project, id },
  });

  const isBoard = indentation === 0;

  const unfinishedCountAll = allChildren.filter((id) =>
    todoTreeIsUnfinishedTask(todoDict[id])
  ).length;

  const unfinishedCount = children.filter(({ id }) =>
    todoTreeIsUnfinishedTask(todoDict[id])
  ).length;

  const isTask = todoTreeIsUnfinishedTask(todoDict[id]);

  const useCount = isBoard ? unfinishedCountAll : unfinishedCount;

  const Icon = getIconForTodo(todoTree);

  return (
    <>
      <div ref={setNodeRef} style={{ paddingLeft: indentation * 20 }}>
        <div
          className={classNames(styles.folderItem, {
            [styles.isDroppable]: isDroppable,
            [styles.isOver]: isOver,
          })}
          // ref={setNodeRef}
          onClick={(e) => {
            e.stopPropagation();
            updateCurrentTodo(id);
          }}
        >
          <div className={styles.left}>
            <Badge
              invisible={!useCount}
              color={"warning"}
              badgeContent={useCount}
              variant={isBoard ? "standard" : "dot"}
            >
              <Icon className={styles.folderIcon} />
            </Badge>
            <div
              className={classNames(styles.name, {
                [styles.isActive]: isActive,
                [styles.isProject]: indentation === 0,
              })}
            >
              {name}
            </div>
          </div>
        </div>
      </div>
      {(() => {
        const items = children.filter(
          (todo) =>
            todoTreeIsFolder(todo) ||
            todoTreeIsProject(todo) ||
            todoTreeIsUnfinishedTask(todo)
        );
        return (
          !isDraggingProject &&
          !!items.length && (
            <div>
              {items.map((todoTreeChild) => (
                <Folder
                  indentation={indentation + 1}
                  key={todoTreeChild.id}
                  todoTree={todoTreeChild}
                />
              ))}
            </div>
          )
        );
      })()}
    </>
  );
};

export const ProjectInner = ({ id }: { id: string }) => {
  const { todoDict } = useGlobalDataContext();
  const todoId = id;

  return <Folder todoTree={todoDict[todoId]} />;
};

const ColOne = ({ className }: { className: string }) => {
  const { todoTreeArray, addTodo } = useGlobalDataContext();

  return (
    <ColumnInner
      className={className}
      bottomContents={
        <Button
          variant="outlined"
          onClick={() => {
            addTodo(BOARD_ID, { name: "New Project" }, true);
          }}
        >
          Add project
        </Button>
      }
    >
      <div className={styles.projects}>
        {todoTreeArray.map(({ id }) => (
          <ProjectInner key={id} id={id} />
        ))}
      </div>
    </ColumnInner>
  );
};

export default ColOne;
