import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import {
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  Link,
  Paper,
} from "@mui/material";
import { TIMELINE_GROUPS } from "data/example";
import { useGlobalDataContext } from "hooks/useGlobalData";
import { get, partition } from "lodash";
import {
  ActiveDrag,
  appendPrefix,
  DD_TYPES,
  removePrefix,
  TG_ALL,
  TodoGroup,
  getDragEventData,
} from "types";
import {
  todoTreeIsUnfinishedTask,
  todoTreeIsFolder,
  todoTreeIsTask,
} from "utils/selectors";
import { CSS } from "@dnd-kit/utilities";
import { Fragment, useState } from "react";
import { useGlobalStateContext } from "hooks/useGlobalState";
import useCurrentTodo from "hooks/useCurrentTodo";
import ColumnInner from "utils/components/ColumnInner";
import styles from "./ColThree.module.scss";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import TextEditor from "utils/components/TextEditor";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import classNames from "classnames";
import { Box } from "@mui/system";

export const TodoCellInner = ({
  id,
  listeners,
  isDragOverlay,
}: {
  id: string;
  listeners?: any;
  isDragOverlay?: boolean;
}) => {
  const { todoDict, editTodo } = useGlobalDataContext();
  const { updateCurrentTodo } = useCurrentTodo();
  const todo = todoDict[id];

  return (
    <Card
      className={styles.card}
      onClick={() => {
        updateCurrentTodo(id);
      }}
    >
      <div className={styles.breadCrumbs}>
        {[...todo.parents].reverse().map((todoParent) => (
          <Fragment key={todoParent}>
            <div className={styles.carrat}>›</div>
            <div
              className={styles.link}
              onClick={(e) => {
                e.stopPropagation();
                updateCurrentTodo(todoParent);
              }}
            >
              {todoDict[todoParent].name}
            </div>
          </Fragment>
        ))}
      </div>
      <div className={styles.middle}>
        <div
          style={{ cursor: "move" }}
          className={styles.iconWrapper}
          {...listeners}
        >
          <DragIndicatorIcon />
        </div>

        <div className={styles.name}>{todo.name}</div>
        <div className={styles.iconWrapper}>
          <Checkbox
            checked={todo.status === "done"}
            onClick={(e) => {
              e.stopPropagation();
              editTodo(id, {
                status: todo.status === "done" ? undefined : "done",
              });
            }}
          />
        </div>
      </div>
    </Card>
  );
};

const TodoCell = ({ id, disabled }: { id: string; disabled?: boolean }) => {
  const todoId = removePrefix(id, DD_TYPES.todoTimeline);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: { type: DD_TYPES.todoTimeline, id: todoId },
      disabled,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <TodoCellInner id={todoId} listeners={listeners} />
    </div>
  );
};

const TodoGroupHolderInner = ({
  items,
  id,
}: {
  items: string[];
  id: string;
}) => {
  const { activeDrag } = useGlobalStateContext();
  const { todoGroupsTree } = useGlobalDataContext();

  const isDroppableDisabled =
    activeDrag &&
    activeDrag.type === DD_TYPES.todoTimeline &&
    todoGroupsTree[id].includes(activeDrag.id);

  const isDroppable = activeDrag && !isDroppableDisabled;

  const { setNodeRef, isOver, over } = useDroppable({
    id: appendPrefix(id, DD_TYPES.todoTimelineGroup),
    disabled: isDroppableDisabled,

    data: {
      type: DD_TYPES.todoTimelineGroup,
      id,
    },
  });

  const isReallyOver =
    isOver || (over && getDragEventData(over).containerId === id);

  console.log(over);

  return (
    <div
      ref={setNodeRef}
      className={classNames(styles.holderInnerWrapper, {
        [styles.isOver]: isReallyOver,
        [styles.isDroppable]: isDroppable,
      })}
    >
      {items.length ? (
        items.map((todoId) => <TodoCell key={todoId} id={todoId} />)
      ) : (
        <Paper elevation={0} className={styles.emptyState}>
          Drag a task
        </Paper>
      )}
    </div>
  );
};

const TodoGroupHolder = ({
  todoGroup: { id, name },
}: {
  todoGroup: TodoGroup;
}) => {
  const {
    todoGroupsTree,
    todoDict,
    editTodoGroup,
    deleteTodoGroup,
    reorderTodoGroup,
  } = useGlobalDataContext();

  const items = todoGroupsTree[id]
    .filter((todoId) => {
      return (
        todoTreeIsTask(todoDict[todoId]) &&
        todoTreeIsUnfinishedTask(todoDict[todoId])
      );
    })
    .map((todoId) => appendPrefix(todoId, DD_TYPES.todoTimeline));

  const inner = (
    <div>
      <SortableContext
        id={id}
        items={items}
        strategy={verticalListSortingStrategy}
      >
        <TodoGroupHolderInner items={items} id={id} />
      </SortableContext>
    </div>
  );

  if (id === TG_ALL) {
    return (
      <Card className={styles.groupHolder}>
        <div className={styles.groupTitle}>Backlog</div>
        {inner}
      </Card>
    );
  }

  return (
    <Card className={styles.groupHolder}>
      <div className={styles.groupTitle}>
        <TextEditor
          className={styles.title}
          value={name}
          onChange={(newName) => editTodoGroup(id, { name: newName })}
        />
        <div className={styles.right}>
          <div className={styles.delete} onClick={() => deleteTodoGroup(id)}>
            <DeleteIcon fontSize="small" />
          </div>
          <div className={styles.sortArrows}>
            <ArrowDropUpIcon
              className={styles.sortArrow}
              onClick={() => {
                reorderTodoGroup(id, "up");
              }}
            />
            <ArrowDropDownIcon
              className={styles.sortArrow}
              onClick={() => {
                reorderTodoGroup(id, "down");
              }}
            />
          </div>
        </div>
      </div>
      {inner}
    </Card>
  );
};

export const SearchScreen = ({ search }: { search?: string }) => {
  const { todoDict } = useGlobalDataContext();

  const todosToShow = Object.values(todoDict).filter((todo) => {
    return !search || todo.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Box sx={{ pt: 5, overflow: "auto", height: "100%" }}>
      <Container>
        {todosToShow.length === 0 ? (
          <Card>No results found</Card>
        ) : (
          todosToShow.map((todo) => (
            <TodoCellInner key={todo.id} id={todo.id} />
          ))
        )}
      </Container>
    </Box>
  );
};

const ColThree = ({ className }: { className: string }) => {
  const { todoGroups, addTodoGroup } = useGlobalDataContext();
  const { isShowingKanban } = useGlobalStateContext();

  const useGroups = isShowingKanban
    ? Object.values(todoGroups).reverse()
    : Object.values(todoGroups);

  return (
    <ColumnInner
      className={className}
      bottomContents={
        <Button
          variant="outlined"
          onClick={() => {
            addTodoGroup({ name: "New Todo Group" });
          }}
        >
          Add Todo Group
        </Button>
      }
    >
      <div
        className={classNames(styles.container, {
          [styles.isShowingKanban]: isShowingKanban,
        })}
      >
        {useGroups.map((todoGroup) => (
          <div className={styles.groupHolderWrapper}>
            <TodoGroupHolder key={todoGroup.id} todoGroup={todoGroup} />
          </div>
        ))}
      </div>
    </ColumnInner>
  );
};

export default ColThree;
