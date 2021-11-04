import { DragOverlay, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useCurrentTodo from "hooks/useCurrentTodo";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { DD_TYPES, TodoTree } from "types";
import {
  doesTodoContainTodo,
  isUnfinishedTask,
  todoTreeIsFolder,
} from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { useGlobalStateContext } from "hooks/useGlobalState";
import {
  Badge,
  Button,
  Card,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ColumnInner from "utils/components/ColumnInner";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import styles from "./ColOne.module.scss";
import classNames from "classnames";

const Folder = ({
  todoTree,
  indentation = 0,
  listeners,
}: {
  todoTree: TodoTree;
  indentation?: number;
  listeners?: any;
}) => {
  const { id, name, children, allChildren } = todoTree;
  const { todoId, updateCurrentTodo } = useCurrentTodo();
  const isActive = doesTodoContainTodo(todoTree, todoId);
  const { activeDrag } = useGlobalStateContext();
  const { todoDict } = useGlobalDataContext();

  const isDraggingProject = activeDrag?.type === DD_TYPES.project;
  const isDraggingValidTodoProject =
    activeDrag?.type === DD_TYPES.todoProject &&
    todoDict[activeDrag.id].parentId !== id &&
    activeDrag.id !== id;

  const isDroppable = isDraggingValidTodoProject;

  const { setNodeRef, isOver } = useDroppable({
    disabled: !isDroppable,
    id: `col-one-folder-${id}`,
    data: { type: DD_TYPES.project, id },
  });

  const unfinishedCount = allChildren.filter((id) =>
    isUnfinishedTask(todoDict[id])
  ).length;

  return (
    <>
      <div style={{ paddingLeft: indentation * 10 }}>
        <div
          className={classNames(styles.folderItem, {
            [styles.isDroppable]: isDroppable,
            // [styles.isOver]: isOver,
          })}
          ref={setNodeRef}
          onClick={(e) => {
            e.stopPropagation();
            updateCurrentTodo(id);
          }}
        >
          <div className={styles.left}>
            <Badge
              color={unfinishedCount ? "warning" : "success"}
              badgeContent={unfinishedCount}
              showZero
            >
              <FolderOpenIcon className={styles.folderIcon} />
            </Badge>
            <div
              className={classNames(styles.name, {
                [styles.isActive]: isActive,
              })}
            >
              {name}
            </div>
          </div>
          {indentation === 0 && <DragIndicatorIcon {...listeners} />}
        </div>
      </div>
      {(() => {
        const items = children.filter(todoTreeIsFolder);
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

export const ProjectInner = ({
  id,
  listeners,
}: {
  id: string;
  listeners?: any;
}) => {
  const { todoDict } = useGlobalDataContext();
  const todoId = id;

  return <Folder todoTree={todoDict[todoId]} listeners={listeners} />;
};

const Project = ({ id }: { id: string }) => {
  const todoId = id.replace("project-", "");

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { type: DD_TYPES.project, id: todoId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <ProjectInner id={todoId} listeners={listeners} />
    </div>
  );
};

const ColOne = ({ className }: { className: string }) => {
  const { todoTreeArray, addTodo } = useGlobalDataContext();

  const projects = todoTreeArray.map(({ id }) => ({
    id: `project-${id}`,
  }));

  return (
    <ColumnInner
      className={className}
      bottomContents={
        <Button
          variant="contained"
          onClick={() => {
            addTodo(undefined, { name: "New Project" }, true);
          }}
        >
          Add project
        </Button>
      }
    >
      <SortableContext
        id={"reorder-projects"}
        items={projects}
        strategy={verticalListSortingStrategy}
      >
        <div className={styles.projects}>
          {projects.map(({ id }) => (
            <Project key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </ColumnInner>
  );
};

export default ColOne;
