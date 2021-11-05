import {
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
} from "@mui/material";

import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import useCurrentTodo from "hooks/useCurrentTodo";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { partition } from "lodash";
import { DD_TYPES, TodoTree, TodoTypes } from "types";
import {
  todoTreeIsUnfinishedTask,
  todoTreeIsBoard,
  todoTreeIsFolder,
  todoTreeIsProject,
} from "utils/selectors";
import { DragOverlay } from "@dnd-kit/core";
import { useGlobalStateContext } from "hooks/useGlobalState";
import { CSS } from "@dnd-kit/utilities";
import TextEditor from "utils/components/TextEditor";
import MarkdownEditor from "utils/components/MarkdownEditor";
import ColumnInner from "utils/components/ColumnInner";
import styles from "./ColTwo.module.scss";

import AddIcon from "@mui/icons-material/Add";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ListAltIcon from "@mui/icons-material/ListAlt";
import classNames from "classnames";
import getIconForTodo from "utils/getIconForTodo";

export const TodoCellInner = ({
  id,
  listeners,
  attributes,
}: {
  id: string;
  listeners?: any;
  attributes?: any;
}) => {
  const { todoDict, editTodo, deleteTodo } = useGlobalDataContext();
  const todo = todoDict[id];
  const { name, status, children, allChildren } = todo;
  const { updateCurrentTodo } = useCurrentTodo();

  const { activeDrag } = useGlobalStateContext();

  const isDroppable =
    activeDrag &&
    activeDrag.type === DD_TYPES.todoProject &&
    activeDrag.containerId?.startsWith(TodoTypes.todo) &&
    todoDict[id].children.length > 0 &&
    activeDrag.id !== id;

  const isChecked = children.length === 0 && status === "done";

  const unfinishedCount = allChildren.filter((id) =>
    todoTreeIsUnfinishedTask(todoDict[id])
  ).length;

  const Icon = getIconForTodo(todo);

  return (
    <Card
      className={classNames(styles.todo, {
        [styles.isChecked]: isChecked,
        [styles.isDroppable]: isDroppable,
      })}
    >
      <div className={styles.left}>
        <div className={styles.drag} {...listeners} {...attributes}>
          <DragIndicatorIcon />
        </div>
        <div className={styles.iconWrapper}>
          {!(todoTreeIsFolder(todo) || todoTreeIsProject(todo)) ? (
            <Checkbox
              checked={status === "done"}
              onClick={(e) => {
                e.stopPropagation();
                editTodo(id, {
                  status: status === "done" ? undefined : "done",
                });
              }}
            />
          ) : (
            <Badge
              invisible={unfinishedCount === 0}
              color={"warning"}
              badgeContent={unfinishedCount}
            >
              <Icon className={styles.folderIcon} />
            </Badge>
          )}
        </div>
        <TextEditor
          className={styles.nameEditor}
          value={name}
          onChange={(newName) => editTodo(id, { name: newName })}
        />
      </div>

      <div className={styles.arrow} onClick={() => updateCurrentTodo(id)}>
        <KeyboardArrowRightIcon />
      </div>
    </Card>
  );
};

const TodoCell = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, data: { type: DD_TYPES.todoProject, id } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoCellInner id={id} listeners={listeners} attributes={attributes} />
    </div>
  );
};

const TodoStack = ({ todos, id }: { todos: TodoTree[]; id: string }) => {
  return (
    <>
      <SortableContext
        id={id}
        items={todos}
        strategy={verticalListSortingStrategy}
      >
        {todos.map(({ id: todoId }) => (
          <TodoCell key={todoId} id={todoId} />
        ))}
      </SortableContext>
    </>
  );
};

const ColTwo = ({ className }: { className: string }) => {
  const { todoTree } = useCurrentTodo();
  const { name, children, id, notes } = todoTree;
  const { addTodo, editTodo, deleteTodo } = useGlobalDataContext();
  const [folders, todos] = partition(children, (todoTree) => {
    return todoTreeIsFolder(todoTree) || todoTreeIsProject(todoTree);
  });
  const [done, notDone] = partition(todos, (a) => a.status === "done");

  return (
    <ColumnInner
      className={className}
      outerContents={
        !todoTreeIsBoard(todoTree) && (
          <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<MoreHorizIcon />}
          >
            <SpeedDialAction
              onClick={() => addTodo(id)}
              icon={<AddIcon />}
              tooltipTitle={"Add Sub Todo"}
            />
            <SpeedDialAction
              onClick={() => deleteTodo(id)}
              icon={<DeleteIcon />}
              tooltipTitle={"Delete This Todo"}
            />
          </SpeedDial>
        )
      }
    >
      <div className={styles.header}>
        <TextEditor
          className={styles.name}
          value={name}
          onChange={(newName) => editTodo(id, { name: newName })}
        />
      </div>
      <MarkdownEditor
        className={styles.notes}
        value={notes}
        onChange={(newNotes) => editTodo(id, { notes: newNotes })}
      />
      <Divider className={styles.divider} variant="middle" />
      <TodoStack id={TodoTypes.folder} todos={folders} />
      <Divider className={styles.divider} variant="middle" />
      <TodoStack id={`${TodoTypes.todo}-notDone`} todos={notDone} />
      <TodoStack id={`${TodoTypes.todo}-done`} todos={done} />
    </ColumnInner>
  );
};

export default ColTwo;
